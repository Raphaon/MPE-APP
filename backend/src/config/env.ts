import dotenv from 'dotenv';

dotenv.config();

function requireEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(requireEnv('PORT', '4000')),
  socketPort: Number(requireEnv('SOCKET_PORT', '4001')),
  jwtSecret: requireEnv('JWT_SECRET'),
  uploadDir: requireEnv('UPLOAD_DIR', './uploads'),
};

export const databaseUrl = requireEnv('DATABASE_URL');
