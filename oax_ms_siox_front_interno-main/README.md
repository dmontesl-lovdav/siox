# AdminContable

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.6.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Local development with local backend (recommended) ✅

- `npm run start:local` — starts the dev server using `src/environments/environment.local.ts` (this file is git-ignored). It also uses `proxy.conf.json` so API paths starting with `/siox` are proxied to your local backends (`/siox/auth` → `http://localhost:9191`, other `/siox` → `http://localhost:9190`). `environment.local.ts` sets `useOauth2: false` so **no Authorization header** will be sent when you run locally.

- `npm run start` — starts the dev server using the default `src/environments/environment.ts` (points to the remote backend). `useOauth2` remains **true** in that configuration, so OAuth2 is active for normal development and production builds. These changes do **not** modify production behavior: production builds still use the normal configuration and OAuth2 remains enabled there.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
