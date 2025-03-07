# Text Adventure Game for Education

## Prerequisites

Ensure you have the following installed:

- [Node](https://nodejs.org/en)
- [PostgreSQL](https://www.postgresql.org/)
- [NGINX](https://nginx.org/)

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

Example:
```ini
DATABASE_URL='postgres://username:password@localhost:5432/database'
```

### 3. Configure BetterAuth Connection

Generate a random value to use as your encryption seed.
Modify the `.env` file located in the `/api` directory to specify this secret.

Example:
```ini
BETTER_AUTH_SECRET='sR17KEeIhzRVtfOR1StK7as6w43imxnE'
```

### 4. Configure OAuth Providers

Create OAuth applications for [Discord](https://discord.com/developers/docs/topics/oauth2), [Google](https://developers.google.com/identity/protocols/oauth2), and [GitHub](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app).

Modify the `.env` file located in the `/api` directory to specify these connections.

Example:
```ini
DISCORD_CLIENT_ID=''
DISCORD_CLIENT_SECRET=''
```

### 5. Configure Resend API

Create a Resend API key [here](https://resend.com/api-keys).
Modify the `.env` file located in the `/api` directory to specify this key.

Example:
```ini
RESEND_API_KEY='re_VNQodBmv_S89xwtZLAb1aerkXti43Z4qf'
```

### 6. Create Database Tables

Run the following command to generate migrations:

```bash
npx drizzle-kit generate
```

Run the following command to apply migrations:

```bash
npx drizzle-kit migrate
```

### 7. Configure NGINX
Update your local NGINX config file to include the routes specified in `nginx-local.conf` then reload NGINX.

## Running the application

### Start the API:

```bash
cd /api
npm run dev
```

### Start the frontend:
```bash
cd /web
npm run dev
```

## Documentation

```
localhost/api/reference
localhost/api/auth/reference
```