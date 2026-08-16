import type { ReactNode } from 'react'

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Text,
  ThemeToggle,
} from '@components/ui'

/**
 * Internal design-system validation page — NOT a product page. Confirms
 * tokens are wired correctly end to end (light/dark, contrast, scales) and
 * gives the foundational components a real place to be exercised together
 * before any business module exists. See docs/design-system/tokens.md.
 *
 * Lives in app/routes/ rather than design-system/documentation/ because it
 * composes components/ui with design-system tokens — and design-system/
 * is not allowed to depend on components/ (see
 * docs/architecture/dependency-rules.md). Only the app layer can compose
 * both.
 */
export function DesignSystemShowcasePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-12 flex items-center justify-between gap-4">
        <div>
          <Text variant="display-sm" as="h1">
            Innovoot Design System
          </Text>
          <Text variant="body-md" className="text-muted-foreground mt-1">
            Internal validation page — tokens, theming, and the foundational component set.
          </Text>
        </div>
        <ThemeToggle />
      </header>

      <Section title="Colors">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          <ColorSwatch name="background" bg="bg-background" fg="text-foreground" bordered />
          <ColorSwatch name="surface" bg="bg-surface" fg="text-foreground" bordered />
          <ColorSwatch
            name="surface-elevated"
            bg="bg-surface-elevated"
            fg="text-foreground"
            bordered
          />
          <ColorSwatch name="muted" bg="bg-muted" fg="text-foreground" bordered />
          <ColorSwatch name="primary" bg="bg-primary" fg="text-primary-foreground" />
          <ColorSwatch name="secondary" bg="bg-secondary" fg="text-secondary-foreground" bordered />
          <ColorSwatch name="accent" bg="bg-accent" fg="text-accent-foreground" />
          <ColorSwatch name="success" bg="bg-success" fg="text-success-foreground" />
          <ColorSwatch name="warning" bg="bg-warning" fg="text-warning-foreground" />
          <ColorSwatch name="error" bg="bg-error" fg="text-error-foreground" />
          <ColorSwatch name="info" bg="bg-info" fg="text-info-foreground" />
        </div>
        <Text variant="caption" className="mt-3 block">
          Every background/foreground pair above is contrast-checked automatically — see
          tests/unit/design-system-tokens.test.ts.
        </Text>
      </Section>

      <Section title="Typography">
        <div className="flex flex-col gap-3">
          <Text variant="display-lg">Display LG</Text>
          <Text variant="display-md">Display MD</Text>
          <Text variant="display-sm">Display SM</Text>
          <Text variant="heading-xl">Heading XL</Text>
          <Text variant="heading-lg">Heading LG</Text>
          <Text variant="heading-md">Heading MD</Text>
          <Text variant="heading-sm">Heading SM</Text>
          <Text variant="body-lg">Body LG — the quick brown fox jumps over the lazy dog.</Text>
          <Text variant="body-md">Body MD — the quick brown fox jumps over the lazy dog.</Text>
          <Text variant="body-sm">Body SM — the quick brown fox jumps over the lazy dog.</Text>
          <Text variant="label">Label text</Text>
          <Text variant="caption">Caption text</Text>
        </div>
      </Section>

      <Section title="Spacing">
        <Text variant="body-sm" className="text-muted-foreground mb-3 block">
          Tailwind&apos;s default scale (driven by a single{' '}
          <code className="text-caption bg-muted rounded px-1 py-0.5">--spacing</code> base unit) —
          no custom spacing tokens were introduced.
        </Text>
        <div className="flex flex-col gap-2">
          {['1', '2', '4', '6', '8', '12', '16'].map((step) => (
            <div key={step} className="flex items-center gap-3">
              <span className="text-caption text-muted-foreground w-10">{step}</span>
              <div
                className={`bg-primary h-4`}
                style={{ width: `calc(var(--spacing) * ${step})` }}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Radius">
        {/* Tailwind's scanner needs each full class name literally present in
            source — a template-literal `rounded-${name}` would silently
            never generate CSS, so the scale is spelled out explicitly. */}
        <div className="flex flex-wrap items-end gap-6">
          <RadiusSwatch label="sm" className="rounded-sm" />
          <RadiusSwatch label="md" className="rounded-md" />
          <RadiusSwatch label="lg" className="rounded-lg" />
          <RadiusSwatch label="xl" className="rounded-xl" />
          <RadiusSwatch label="full" className="rounded-full" />
        </div>
      </Section>

      <Section title="Shadows">
        <div className="flex flex-wrap gap-6">
          <ShadowSwatch label="xs" className="shadow-xs" />
          <ShadowSwatch label="sm" className="shadow-sm" />
          <ShadowSwatch label="md" className="shadow-md" />
          <ShadowSwatch label="lg" className="shadow-lg" />
        </div>
      </Section>

      <Section title="Components">
        <Text variant="heading-sm" as="h3" className="mb-2">
          Button
        </Text>
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>

        <Text variant="heading-sm" as="h3" className="mb-2">
          Badge
        </Text>
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <Badge>Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>

        <Text variant="heading-sm" as="h3" className="mb-2">
          Input
        </Text>
        <div className="mb-6 flex max-w-sm flex-col gap-4">
          <Input
            label="Email address"
            placeholder="you@example.com"
            hint="We'll never share this."
          />
          <Input label="Password" type="password" error="Password must be at least 8 characters." />
        </div>

        <Text variant="heading-sm" as="h3" className="mb-2">
          Card
        </Text>
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Card title</CardTitle>
            <CardDescription>A short supporting description.</CardDescription>
          </CardHeader>
          <CardContent>
            <Text variant="body-sm">Card body content goes here.</Text>
          </CardContent>
        </Card>
      </Section>
    </main>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-12">
      <Text variant="heading-lg" as="h2" className="border-border mb-4 border-b pb-2">
        {title}
      </Text>
      {children}
    </section>
  )
}

function RadiusSwatch({ label, className }: { label: string; className: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`border-border bg-secondary h-16 w-16 border ${className}`} />
      <Text variant="caption">{label}</Text>
    </div>
  )
}

function ShadowSwatch({ label, className }: { label: string; className: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`bg-surface h-16 w-16 rounded-md ${className}`} />
      <Text variant="caption">{label}</Text>
    </div>
  )
}

function ColorSwatch({
  name,
  bg,
  fg,
  bordered,
}: {
  name: string
  bg: string
  fg: string
  bordered?: boolean
}) {
  return (
    <div
      className={`flex h-20 flex-col justify-between rounded-md p-3 ${bg} ${fg} ${bordered ? 'border-border border' : ''}`}
    >
      <span className="text-label font-medium">{name}</span>
    </div>
  )
}
