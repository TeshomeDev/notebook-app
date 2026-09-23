## Folder Structure
```bash
notebook-app
├── docs
│   └── ARCHITECTURE.md
├── src
│   ├── assets
│   │   └── images
│   │       ├── notebook-d.png
│   │       ├── notebook-d1.png
│   │       ├── notebook-m.png
│   │       ├── notebook-m1.png
│   │       ├── notebook-m3.png
│   │       └── notebook-m4.png
│   ├── design-system
│   │   ├── components
│   │   │   ├── active-section.css
│   │   │   ├── button.css
│   │   │   ├── delete-confirmation-popover.css
│   │   │   ├── editor.css
│   │   │   ├── empty-editor-card.css
│   │   │   ├── index.css
│   │   │   ├── menu-button.css
│   │   │   ├── note-card.css
│   │   │   ├── notice.css
│   │   │   ├── sidebar-footer.css
│   │   │   └── toolbar.css
│   │   ├── layout
│   │   │   ├── app.css
│   │   │   ├── editor.css
│   │   │   ├── empty-editor-card.css
│   │   │   ├── hamburger-menu.css
│   │   │   ├── index.css
│   │   │   ├── note-card.css
│   │   │   ├── sidebar-footer.css
│   │   │   └── sidebar.css
│   │   ├── tokens
│   │   │   ├── color.css
│   │   │   ├── index.css
│   │   │   ├── shape.css
│   │   │   ├── size.css
│   │   │   ├── spacing.css
│   │   │   └── typography.css
│   │   ├── base.css
│   │   └── index.css
│   ├── domain
│   │   ├── note-actions.js
│   │   ├── note-actions.test.js
│   │   ├── noteConstants.js
│   │   ├── noteReducer.js
│   │   └── noteReducer.test.js
│   ├── events
│   │   ├── editorEvents.js
│   │   ├── sidebarEvents.js
│   │   └── toolbarEvents.js
│   ├── services
│   │   ├── storage.js
│   │   └── storage.test.js
│   ├── side-effects
│   │   ├── sideEffects.js
│   │   └── sideEffects.test.js
│   ├── state
│   │   ├── state.js
│   │   └── state.test.js
│   ├── ui
│   │   ├── helpers.js
│   │   ├── layout.js
│   │   ├── renderEditor.js
│   │   ├── renderNotice.js
│   │   ├── renderSidebar.js
│   │   └── renderTitle.js
│   ├── use-cases
│   │   ├── use-cases.js
│   │   └── useCases.test.js
│   ├── utilities
│   │   ├── noteHelper.test.js
│   │   └── noteHelpers.js
│   └── app.js
├── tests
│   └── integration
│       └── note-workflows.test.js
├── README.md
├── index.html
├── package-lock.json
├── package.json
└── vitest.config.js
```

## Modules
| Folder | Responsibility |
|--------|----------------|
| `state/`| Centeralized state, single source of truth |
| `domain/` | Pure business rules - doesn't depend on other modules |
| `use-cases/` | Orchestrate domain and state for user actions |
| `services/` | External boundaries (storage and APIs) |
| `side-effects/` | React to state changes (auto-save, timers) |
| `ui/` | Render state |
| `events/`| Attach event listeners, wire DOM events to use cases |

## Communication

- UI **never** mutates states directly - calls use cases
- Use cases **never** touch states directly - go through a single mutation gateway
- Services **never** know about UI - only expose an API
- Domain **never** imports - pure logic
- Side effects **subscribe** to state changes - don't get called
- UI too **subscribe** to state changes - don't know about how it changed

## Why this architecture
- **Testable** - each module can be tested in isolation
- **Framework-agnostic** - UI can be swapped without touching logic
- **Storage-agnostic**
- **Predictable** - one direction data flow