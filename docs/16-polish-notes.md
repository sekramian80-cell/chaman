# Polish backlog notes

Completed in branch `polish-perf-a11y-docs`:

1. Image compression via `npm run optimize:images` (sharp, in-place JPG/PNG)
2. Accessibility: skip link, `:focus-visible`, `aria-current` on nav, FAQ decorative aria-hidden
3. Cache SWR: serve stale/fresh cache immediately, always revalidate in background
4. Docs folder tracked in git
5. Light client monitoring: ErrorBoundary + session error log + optional `CONFIG.MONITORING.ENDPOINT`
