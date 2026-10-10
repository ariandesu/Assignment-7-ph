import { betterAuth } from 'better-auth';

// In Serverless/Vercel environments, a local SQLite file is read-only.
// We configure BetterAuth without a persistent database for UI assignment evaluation.
// Social login and persistent sessions will not fully function without a real remote DB
// (like Postgres or a managed SQLite on Turso/Cloudflare D1), which is out of scope 
// for this pure-UI assignment's requirements.

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || 'https://bazardor-assignment-7.vercel.app',
  secret: process.env.BETTER_AUTH_SECRET || 'bazardor-secret-key-32-chars-minimum-token',
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 6,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || 'dummy-google-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-google-client-secret',
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || 'dummy-github-client-id',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || 'dummy-github-client-secret',
    },
  },
});
