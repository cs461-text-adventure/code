# Text Adventure Game for Education

## Prerequisites

Ensure you have the following installed:

- [Deno](https://deno.land/)
- [PostgreSQL](https://www.postgresql.org/)

## Installation

### 1. Install Dependencies

Run the following command to install necessary dependencies:

```bash
deno install
```

### 2. Configure Postgres Connection

Modify the `.env` file located in the `/api` directory to specify your Postgres connection URL.

Example `.env` file:

```ini
DATABASE_URL=postgres://username:password@localhost:5432/database
```

### 3. Create Database Tables

Run the following command to generate migrations:

```bash
deno run -A npm:drizzle-kit generate
```

Run the following command to apply migrations:

```bash
deno run -A npm:drizzle-kit migrate
```

## Running the application

## To start the API:

```bash
cd /api
deno task dev
```

## To start the frontend:
```bash
cd /web
deno task dev
```