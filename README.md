# BE-assignment

This is a Node.js TypeScript project for a backend assignment. It utilizes Express for handling HTTP requests, TypeScript for type-safe coding, JSON Web Token (jsonwebtoken) for authentication, and Jest for unit testing.

# Api-Endpoints

```
/api/v1/users/register --> registration endpoint
/api/v1/users/login --> login endpoint
/api/v1/users/getUser --> get user info based on token validation
```

## Middlewares

### 1. **isAuth**

- This middleware extracts the token from the request object and utilizes it to retrieve the user ID.

### 2. **redisRateLimiter**

- This middleware employs Redis for the implementation of an API limiting mechanism.

### 3. **xss**

- This middleware safeguards the site against cross-site scripting attacks by sanitizing the request object.

## Environment Variables

Create a `.env` file in the root of your project with the following variables:

```env
Postgres_URL=
NODE_ENV=
SECRET=
PORT=
```

## Getting Started

Follow these steps to set up and run the project on your local machine:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/adi790uu/BE-assignment.git

   ```

2. **Navigate to the project directory:**

   ```bash
   cd BE-assignment
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Start the development server:**

   ```bash
   npm start
   ```

   The server will be running at `http://localhost:${PORT}`.

## Running with Docker

You can also run the application using Docker. Make sure you have Docker installed on your machine.

1. **Build the Docker image:**

   ```bash
   docker build -t be-assignment .
   ```

2. **Run the Docker container:**

   ```bash
   docker run -p 3000:3000 be-assignment
   ```

## Tech Stack

- **Express:** A fast, unopinionated, minimalist web framework for Node.js.
- **Node.js:** A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **TypeScript:** A superset of JavaScript that adds static types to the language.
- **JSON Web Token (jsonwebtoken):** A compact, URL-safe means of representing claims to be transferred between two parties.
- **Jest:** A delightful JavaScript Testing Framework with a focus on simplicity.
- **Zod:** Zod is a TypeScript-first schema declaration and validation library.

## Unit Testing

Jest is used for writing and running unit tests. To execute the tests, run the following command:

```bash
npm test
```

tests --->

1. **Registration Endpoint tests**
2. **Login Endpoint tests**

## Rate Limiting

I have tried custom rate limiting using redis as well as limiting using express-rate-limit library, in this project I am going with
express-rate-limit library.

```
windowMs: Your time window in ms,
max: maximun requests allowed within the time window, In the code it is 10 requests/hour
handler: handles the message sent and staus code when limit exceeds,
standardHeaders: true,
legacyHeaders: false,
```
