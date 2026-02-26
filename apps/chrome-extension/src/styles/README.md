# Design system (SCSS)

Reusable visual system built with **SCSS only**: tokens, mixins, and component classes. No JS/CSS-in-JS.

## Structure

```
styles/
├── _tokens.scss       # Design tokens (colors, spacing, typography, radius, shadow, motion)
├── _mixins.scss       # Reusable mixins (card, button, form, badge, status, layout)
├── design-system.scss # Entry: forwards tokens + loads all components
├── components/
│   ├── _card.scss     # .ds-card, .ds-card__header, .ds-card__body
│   ├── _button.scss   # .ds-button, .ds-button--primary, .ds-button--danger, .ds-button--secondary, .ds-button--block
│   ├── _form.scss     # .ds-field, .ds-label, .ds-input-range
│   ├── _badge.scss    # .ds-badge, .ds-badge--muted, .ds-badge--error, .ds-badge--success
│   ├── _status.scss   # .ds-status, .ds-status--loud, .ds-status--warning, .ds-status--normal, .ds-status--idle
│   └── _layout.scss   # .ds-container, .ds-section, .ds-title, .ds-empty-state, .ds-stack-row
└── README.md
```

## Usage

In any SCSS file (e.g. `Popup.scss`):

```scss
@use '../styles/design-system' as *;

body {
  font-family: $ds-font-family-base;
  width: $ds-popup-width;
}
```

Use component classes in JSX/HTML:

- **Layout:** `ds-container`, `ds-section`, `ds-title`, `ds-stack-row`, `ds-stack-row__value`, `ds-empty-state`
- **Card:** `ds-card`, `ds-card__header`, `ds-card__body`
- **Button:** `ds-button`, `ds-button--primary`, `ds-button--danger`, `ds-button--secondary`, `ds-button--block`
- **Form:** `ds-field`, `ds-label`, `ds-input-range`
- **Badge:** `ds-badge`, `ds-badge--muted`, `ds-badge--error`, `ds-badge--success`
- **Status:** `ds-status`, `ds-status--loud`, `ds-status--warning`, `ds-status--normal`, `ds-status--idle`

## Extending

- **New tokens:** Add to `_tokens.scss` and use in components or mixins.
- **New mixins:** Add to `_mixins.scss` and use inside component partials.
- **New components:** Add a partial under `components/` and `@use 'components/your-component'` in `design-system.scss`.
