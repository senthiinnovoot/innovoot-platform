import js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import boundaries from 'eslint-plugin-boundaries'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

// Element types for eslint-plugin-boundaries — mirrors the layers described
// in docs/architecture/dependency-rules.md. Keep this list and the policies
// below in sync with that doc; it is the enforced version of the
// dependency direction, not just documentation.
const elements = [
  { type: 'app', pattern: 'src/app/*' },
  { type: 'module', pattern: 'src/modules/*', capture: ['moduleName'] },
  { type: 'components', pattern: 'src/components/*' },
  { type: 'shared', pattern: 'src/shared/*' },
  { type: 'design-system', pattern: 'src/design-system/*' },
  { type: 'infrastructure', pattern: 'src/infrastructure/*' },
]

const el = (type, captured) => ({ element: captured ? { type, captured } : { type } })
const to = (type, captured) => ({ to: el(type, captured) })

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'playwright-report', 'node_modules'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
      boundaries,
    },
    settings: {
      'boundaries/elements': elements,
      // Required so eslint-plugin-boundaries resolves our path aliases
      // (@app/*, @modules/*, ...) to real files instead of treating them
      // as unresolvable external packages, which would silently disable
      // enforcement for every aliased import in the codebase.
      'import/resolver': {
        typescript: { project: './tsconfig.app.json' },
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // --- Module-first architecture enforcement -----------------------
      // See docs/architecture/dependency-rules.md for the rationale.
      // Uses the modern (v7) `boundaries/dependencies` rule + `policies`
      // syntax — the legacy `element-types`/`rules` syntax silently failed
      // to flag real violations when tested against this plugin version.
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          policies: [
            // app sits at the top: may depend on everything below it, and
            // its own subfolders (routes/layouts/providers/config) may
            // freely reference each other — they're organizational, not an
            // enforced boundary.
            {
              from: el('app'),
              allow: [
                to('app'),
                to('module'),
                to('components'),
                to('shared'),
                to('design-system'),
                to('infrastructure'),
              ],
            },
            // a module may use shared UI/logic, infrastructure interfaces,
            // and any other module's element type. Whether a specific FILE
            // within another module may be imported (only its index.ts) is
            // enforced separately below by boundaries/entry-point — that
            // rule does not fire for imports within the same module.
            {
              from: el('module'),
              allow: [
                to('components'),
                to('shared'),
                to('design-system'),
                to('infrastructure'),
                to('module'),
              ],
            },
            // generic components must stay domain-agnostic.
            {
              from: el('components'),
              allow: [to('components'), to('shared'), to('design-system')],
            },
            // shared logic must stay generic.
            { from: el('shared'), allow: [to('shared'), to('design-system')] },
            // design-system is the foundation layer — no upward deps.
            { from: el('design-system'), allow: [to('design-system')] },
            // infrastructure is a leaf integration layer.
            { from: el('infrastructure'), allow: [to('infrastructure')] },
          ],
        },
      ],
      // Other modules may only import a module's public index.ts —
      // never reach into modules/<x>/services/foo.ts directly. (Does not
      // apply to imports from within the same module.)
      'boundaries/entry-point': [
        'error',
        {
          // `default` applies to ANY target type not matched by a policy
          // below, not just unmatched files within a matched type — so
          // every element type needs an explicit policy, even the
          // wide-open ones, or their imports would be blocked too.
          default: 'disallow',
          policies: [
            { target: el('module'), allow: ['index.ts'] },
            { target: el('app'), allow: ['**'] },
            { target: el('components'), allow: ['**'] },
            { target: el('shared'), allow: ['**'] },
            { target: el('design-system'), allow: ['**'] },
            { target: el('infrastructure'), allow: ['**'] },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  // Prettier owns formatting; must stay last to disable conflicting stylistic rules.
  prettierConfig,
)
