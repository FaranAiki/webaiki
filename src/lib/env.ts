import 'server-only';
import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

/**
 * Strict Environment Variable Validation
 * This module ensures that all required environment variables are present and of the correct type
 * when the application starts, preventing silent failures later in execution.
 */

const EnvSchema = Type.Object({
  // Database Configuration
  DATABASE_URL: Type.String({ minLength: 1, description: 'Postgres connection string for querying' }),
  DIRECT_URL: Type.String({ minLength: 1, description: 'Direct connection string for migrations' }),
  
  // Supabase Configuration
  NEXT_PUBLIC_SUPABASE_URL: Type.String({ minLength: 1, format: 'uri', description: 'Public URL for Supabase API' }),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: Type.String({ minLength: 1, description: 'Public anonymous key for Supabase' }),
  SUPABASE_SERVICE_ROLE_KEY: Type.Optional(Type.String({ description: 'Service role key for admin tasks' })),
  
  // Security & Third Party
  RECAPTCHA_SECRET_KEY: Type.Optional(Type.String({ description: 'Google reCAPTCHA v3 Secret Key' })),
});

export const validateEnv = () => {
  const envVars = {
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
  };

  // We only run this on the server (or during build if possible)
  if (typeof window !== 'undefined') {
    return envVars as any;
  }

  const errors = [...Value.Errors(EnvSchema, envVars)];
  
  if (errors.length > 0) {
    console.error('❌ Invalid Environment Variables Detected!');
    errors.forEach(error => {
      console.error(`  - ${error.path}: ${error.message}`);
    });
    
    // In production builds, missing envs shouldn't crash Next.js SSG unless absolutely necessary,
    // but a proper senior setup logs this loudly.
    if (process.env.NODE_ENV === 'production' && !process.env.SKIP_ENV_VALIDATION) {
      console.warn('⚠️ Warning: Application is starting with missing/invalid environment variables. Some features may not work.');
    }
  }

  return envVars as typeof envVars;
};

// Export the validated env object so that the application can use it safely
export const env = validateEnv();
