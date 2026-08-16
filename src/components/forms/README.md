# components/forms

Composite form building blocks — generic across all modules' forms, with no react-hook-form
coupling at this layer.

**Status:** Phase 3A — `FormField`, `FormActions`.

## Rule

Everything here must be reusable across unrelated modules with no import from `modules/`. If a
component needs to know about customers, orders, or any other business domain, it belongs in that
module's `components/` folder instead — see docs/architecture/module-architecture.md.

Before adding a new component here, search `components/` and existing modules for something close
enough to extend — see the reusability rules in `CLAUDE.md`.

## `FormField`

Presentational and form-library-agnostic — it does not import or know about react-hook-form.
Connects a label, required indicator, and hint/error text to whatever control its render-prop
`children` renders, via an explicit, typed `field` object (`id`, `aria-describedby`,
`aria-invalid`, `aria-required`) rather than implicit `cloneElement` prop injection.

```tsx
<FormField label="Bio" hint="Shown on your public profile" error={errors.bio}>
  {(field) => <Textarea {...field} value={bio} onChange={(e) => setBio(e.target.value)} />}
</FormField>
```

Use a primitive's own `label`/`hint`/`error` props directly for the simple case instead (see
`components/ui/README.md#self-labelling-vs-componentsformsformfield`) — don't use both
accessibility systems on the same control.

## `FormActions`

Thin, domain-agnostic layout for a form's action buttons (submit/cancel row). Mobile-first: stacks
full-width on narrow viewports.
