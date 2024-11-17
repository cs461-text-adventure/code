# Text Adventure Game for Education

## Prerequisites

Ensure you have the following installed:

- [Node](https://nodejs.org/en)
- [PostgreSQL](https://www.postgresql.org/)

## Installation

### 1. Install Dependencies

Run the following command to install necessary dependencies:

```bash
cd /api
npm install
```

```bash
cd /web
npm install
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
npx drizzle-kit generate
```

Run the following command to apply migrations:

```bash
npx drizzle-kit migrate
```

## Running the application

## To start the API:

```bash
cd /api
npm run dev
```

## To start the frontend:
```bash
cd /web
npm run dev
```