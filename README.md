# Vinyl Market — Sanity Studio

Sanity Content Studio for **Vinyl Market**: manage **artists**, **labels**, and **releases** (cover and gallery images, multi-disc track listings, formats, speeds, labels, and dates).

## Requirements

- **Node.js v24.12.0** (or compatible 24.x)
- A [Sanity](https://www.sanity.io) account for Studio login

## Setup

Install dependencies:

```bash
yarn install
```

Configure the Sanity project and dataset (IDs are not secret but usually differ per machine or deploy):

```bash
cp .env.example .env
```

Edit `.env` if you need to change `SANITY_STUDIO_PROJECT_ID` or `SANITY_STUDIO_DATASET`. Values are read via [`sanity.project.ts`](sanity.project.ts).

## Commands

| Command | Description |
|--------|-------------|
| `yarn dev` | Run Studio locally with hot reload |
| `yarn build` | Production build to `./dist` |
| `yarn start` | Serve the built Studio |
| `yarn deploy` | Deploy Studio to Sanity hosting |
| `yarn deploy-graphql` | Deploy the GraphQL API (if you use it) |

## First run

```bash
yarn dev
```

Open the URL shown in the terminal and sign in when prompted. Use **Vision** in the Studio sidebar to experiment with GROQ queries.

## Content model (overview)

- **Artist** — name, cover image, ordered gallery
- **Label** — name, cover image, ordered gallery
- **Release** — artist and optional label references, name, cover + gallery, format (LP / EP / Single) and speed, release date (or “unknown”), discs with ordered tracks (`position` + title)

## Learn more

- [Sanity getting started](https://www.sanity.io/docs/introduction/getting-started?utm_source=readme)
- [Sanity community](https://www.sanity.io/community/join?utm_source=readme)
