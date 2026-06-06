import dotenv from 'dotenv';
dotenv.config();

const REQUIRED_ENV_VARS = [
  'MONGODB_URI',
  'JWT_SECRET',
  'PORT'
];

/**
 * Validates that all required environment variables are set.
 * Throws a fatal error and terminates the process if any are missing.
 */
export const validateEnv = () => {
  const missing = [];

  for (const varName of REQUIRED_ENV_VARS) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    console.error('========================================================================');
    console.error('FATAL ERROR: Missing Required Environment Variables:');
    for (const name of missing) {
      console.error(`  - ${name}`);
    }
    console.error('Please configure them in your .env file before starting the application.');
    console.error('========================================================================');
    process.exit(1);
  } else {
    console.log('✔ Environment variables validation passed.');
  }
};
