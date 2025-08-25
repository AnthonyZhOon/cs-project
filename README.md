# Task Management System

- Each Monash club/team has their own _workspace_.
- Workspaces contain _tasks_ and _events_.
- When someone creates a workspace, they become the _owner_ and automatically get the _manager_ role.
- Managers can invite other users by email to a workspace. If a user does not exist yet with that email, they will be able to see the invite when they sign up.

## Permissions

- 'Normal' members (`MEMBER` role) can only
  - create tasks and assign them to themselves
  - edit tasks that have been assigned to them
- Managers (`MANAGER` role) can do everything except
  - add/remove managers
  - delete workspace
- The owner of a workspace (who always has the `MANAGER` role) can do everything.

## Development

Tools required:

- Node.js version 22
- pnpm version 10
- Docker or PostgreSQL (optional, to run development database. alternatively I think there's a development Neon branch you could use?)

Install dependencies:

```sh
pnpm install
```

Run a dev server:

```sh
pnpm dev
```

### Local Database Setup

If you have Docker installed, you can run

```sh
pnpm db:start
```

to start a development database. Once you have done this, update the following variables in `.env`:

```sh
NEON_POSTGRES_PRISMA_URL="postgres://prisma:password@localhost:54320/dev"
NEON_DATABASE_URL_UNPOOLED="postgres://prisma:password@localhost:54320/dev"
```

Run the following to add some test data to the database:

```sh
pnpm db:seed
```

To clear all the data in the database:

```sh
pnpm db:drop
```

To stop the database:

```sh
pnpm db:stop
```

### Backend Test

Once you have followed the instructions above to set up a local database, you should be able to run the backend tests:

```sh
pnpm test
```

### Vercel Setup

Get the Vercel API token `$TOKEN` from the pins in the Discord group chat.

```sh
pnpx vercel pull --environment=production --token=$TOKEN
# This populates the `.env` file with the URLs needed to connect with the database, etc.
pnpx vercel env pull .env --environment=production --token=$TOKEN
```
