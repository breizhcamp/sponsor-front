# sponsor-front

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

Create a `.env.local` file at the root of the project and configure the
[Kalon](https://github.com/breizhcamp/kalon) URL :

```sh
VITE_KALON_URL=http://localhost:4010
```

Then create the production build:

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
