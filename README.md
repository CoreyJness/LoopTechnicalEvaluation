# Loop Technical Evaluation — QA Test Suite

A full QA automation project built for the Loop technical evaluation. The suite verifies task cards, columns, and tags across two sections of a demo app using Playwright and data-driven testing techniques in JavaScript.

---

## Projects

### DataDrivenTest
The primary deliverable. A Playwright test suite driven entirely by a JSON data file — all six test cases plus login verification are generated dynamically from a single source of truth. Adding a new test case requires no code changes.

### ElectronApp
A desktop UI built with Electron that wraps the individual Playwright test scripts. Designed to make test execution accessible to non-technical stakeholders — no terminal required. Each test can be triggered from the UI with live output streamed directly to the screen.

---

## Test Coverage

| ID | Section | Task | Column | Tags |
|---|---|---|---|---|
| TC001 | Web Application | Implement user authentication | To Do | Feature, High Priority |
| TC002 | Web Application | Fix navigation bug | To Do | Bug |
| TC003 | Web Application | Design system updates | In Progress | Design |
| TC004 | Mobile Application | Push notification system | To Do | Feature |
| TC005 | Mobile Application | Offline mode | In Progress | Feature, High Priority |
| TC006 | Mobile Application | App icon design | Done | Design |

---

## Tech Stack

- [Playwright](https://playwright.dev/) — browser automation and test assertions
- [Electron](https://www.electronjs.org/) — desktop UI for non-technical test execution
- JavaScript (Node.js)

---

## Getting Started

Each project has its own setup instructions. See the README inside each folder:

- [`DataDrivenTest/README.md`](./DataDrivenTest/README.md)
- [`ElectronApp/README.md`](./ElectronApp/README.md)

---

## Demo App

**URL:** https://animated-gingersnap-8cf7f2.netlify.app/  
**Username:** admin  
**Password:** password123
