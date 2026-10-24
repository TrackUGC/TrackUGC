# React + Vite

## Deploying

```sh
firebase login
firebase deploy --only firestore:rules
npm run deploy
```

The waitlist count is stored alongside email submissions and updated in the
same Firestore transaction. The rules allow reading only the counter, not
email documents, and require each counter increment to accompany a new waitlist
entry. This avoids Cloud Functions and its Blaze-plan requirement. Before
deploying the rules, merge them with any existing Firestore rules so they don't
replace protections for other collections. Create
`settings/waitlistCounter` once in Firestore with `count` set to the current
number of documents in `waitlist` and `lastEntryId` set to `initial`; this
seeds the counter for existing signups.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
