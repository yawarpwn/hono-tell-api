# Hono Tell API

This project is a serverless API built with [Hono](https://hono.dev/) and deployed on [Cloudflare Workers](https://workers.cloudflare.com/). It uses [Drizzle ORM](https://orm.drizzle.team/) for database interactions with [Cloudflare D1](https://developers.cloudflare.com/d1/).

## Tech Stack

- **Framework:** [Hono](https://hono.dev/)
- **Platform:** [Cloudflare Workers](https://workers.cloudflare.com/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Database:** [Cloudflare D1](https://developers.cloudflare.com/d1/)
- **Authentication:** [bcryptjs](https://www.npmjs.com/package/bcryptjs), [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- **File Uploads:** [Cloudinary](https://cloudinary.com/)
- **Email:** [Resend](https://resend.com/)
- **Validation:** [Zod](https://zod.dev/)

## API Endpoints

The API provides the following functionalities:

- **/agencies**: Manage agencies.
- **/auth**: User authentication (login, registration).
- **/customers**: Manage customers.
- **/labels**: Manage labels.
- **/product-categories**: Manage product categories.
- **/products**: Manage products.
- **/quotations**: Manage quotations.
- **/send-mail**: Send emails.
- **/signal-categories**: Manage signal categories.
- **/signals**: Manage signals.
- **/subscribe**: Handle subscriptions.
- **/users**: Manage users.
- **/watermarks**: Manage watermarks.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/)
- [Cloudflare account](https://dash.cloudflare.com/sign-up) and [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/get-started/)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the root of the project with the following variables:

```
DATABASE_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
JWT_SECRET=
RESEND_API_KEY=
```

### Database

- **Generate Migrations:**
  ```bash
  npm run db:generate
  ```
- **Run Migrations (local):**
  ```bash
  npm run db:migrate
  ```
- **Run Migrations (production):**
  ```bash
  npm run db:migrate-production
  ```

### Development

To start the development server, run:

```bash
npm run dev
```

### Deployment

To deploy the application to Cloudflare Workers, run:

```bash
npm run deploy
```