# React + Vite

## Deploying

The waitlist counter is served by a Firebase callable Cloud Function. Deploy it
first to the configured `trackugc` project after installing the Firebase CLI
and logging in:

```sh
firebase login
firebase deploy --only functions:getWaitlistCount
```

Deploying Cloud Functions requires the Firebase project to use the Blaze
pay-as-you-go plan. The callable returns only the waitlist document count; it
does not return email addresses.

After the function deploys, build the site and publish it to `gh-pages`:

```sh
npm run deploy
```

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
