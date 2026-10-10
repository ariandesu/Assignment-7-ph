import { betterAuth } from 'better-auth';
import { MongoClient, Db } from 'mongodb';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

function getMongoDb(): Db {
  if (cachedDb && cachedClient) return cachedDb;
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    // Build-time: return a proxy that throws only when methods are actually called
    return new Proxy({} as Db, {
      get(_target, prop) {
        if (prop === 'collection' || prop === 'command' || prop === 'listCollections' || prop === 'dropCollection' || prop === 'createCollection') {
          return () => {
            throw new Error('MongoDB not connected - MONGODB_URI not configured');
          };
        }
        if (typeof prop === 'symbol') return undefined;
        return undefined;
      },
    }) as Db;
  }
  if (!cachedClient) {
    cachedClient = new MongoClient(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
      minPoolSize: 0,
      // TLS options for Atlas
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false,
    });
  }
  cachedDb = cachedClient.db(process.env.MONGODB_DB || 'bazardor');
  return cachedDb;
}

// MongoDB Atlas provides persistent storage for users, sessions, and accounts.
// The mongodbAdapter handles schema mapping (e.g., _id ↔ id) and transactions.
// Connection is established lazily on first auth request to support build-time execution.

const auth = betterAuth({
  database: mongodbAdapter(getMongoDb()),
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

export { auth };
