This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Docker

The application requires a MySQL database. Docker Compose starts MySQL, applies
the current Prisma schema to a clean database, and then starts the standalone
Next.js server.

```bash
cp .env.docker.example .env
# Replace all placeholder secrets in .env, then run:
docker compose up --build -d
```

Compose loads runtime secrets from the `.env` file in the same directory as
`compose.yaml`. Keep `DATABASE_URL`, `NEXTAUTH_SECRET`, and all MySQL passwords
there; `.env` is excluded from Git and from the Docker build context.

Open `http://localhost:3000`. Check container state and logs with:

```bash
docker compose ps
docker compose logs -f app
```

MySQL data is persisted in the named `mysql-data` volume. The database is not
published to the host. A reverse proxy is not required for local use; in
production, place the app behind the platform ingress or a TLS reverse proxy.

Large image assets are not stored in Git or baked into the image. Before
starting the stack, place them on the Docker host in these directories:

```text
/opt/usclosers-constructor/images
/opt/usclosers-constructor/solutions
```

Compose mounts them read-only as `/app/public/images` and
`/app/public/solutions`. Preserve the same relative paths and filenames that
were used under the project's `public/images` and `public/solutions` folders.

The existing Prisma migration history does not match the current schema, so the
one-shot `db-init` service currently uses `prisma db push` for clean deployments.
Create a current baseline migration before adopting migration-driven production
deployments.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
