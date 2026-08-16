# app/

Application shell only — composition, not business logic.

```text
app/
├── routes/     # Route tree assembly (react-router). Registers module routes; defines no page bodies.
├── layouts/    # App-wide chrome (RootLayout, future AuthLayout, DashboardLayout).
├── providers/  # Global React providers (query client, theming, auth context).
└── config/     # Centralized env/config access — never read import.meta.env elsewhere.
```

`app/` may import from `modules/`, `components/`, `shared/`, and `design-system/`.
Nothing should import _from_ `app/` — it sits at the top of the dependency graph.
See docs/architecture/dependency-rules.md.
