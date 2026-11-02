# Lab 8 — Registry: user information capture

A three-page site that captures a person's details with HTML form elements and displays them on other pages using JavaScript.


| Page | What it does |
|------|--------------|
| `index.html` | Registration form: full name, gender, mobile number, email, country, state (filtered by country), city |
| `profile.html` | Shows the latest record, or the one given by `?id=`, with previous/next navigation and print |
| `entries.html` | Searchable list of every record, newest first; remove one or all |

## How the data moves between pages
`js/app.js` holds a small `Store` around `localStorage` (key `lab8.users`). The form validates, saves an object, then redirects to `profile.html?id=…`. The other pages read the same store, and every value is rendered with `textContent`, so user input is never parsed as HTML.

## Design
Built with an Accessible & Ethical focus and a Swiss-minimal style:
- Newsreader (display) + Public Sans (UI), one deep-blue accent, hairline rules instead of cards and shadows, light and dark themes
- Validation runs when you leave a field, with a focusable error summary on submit that links to each field (`aria-describedby` on every input)
- 44–48px touch targets, visible focus rings, `prefers-reduced-motion`, and no horizontal scroll at 375px (the table reflows into a list)
