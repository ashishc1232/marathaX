// /** TREAT AS IMMUTABLE - This file is protected by the file-edit tool
//  *
//  * Database configuration loader
//  */
// import { existsSync, readFileSync } from 'node:fs';
// import { join } from 'node:path';
// import { env } from 'node:process';

// /**
//  * Database credentials interface
//  */
// export interface DatabaseCredentials {
//   host: string;
//   port: number;
//   user: string;
//   password: string;
//   database: string;
// }

// /**
//  * Load database configuration from the task-local config file.
//  * Reads from $NOMAD_TASK_DIR/config.json (defaults to /local/config.json).
//  *
//  * @returns Database connection credentials
//  * @throws Error if config file not found or invalid
//  */
// export function getDatabaseCredentials(): DatabaseCredentials {
//   const configPath = join(env.NOMAD_TASK_DIR || '/local', 'config.json');

//   if (!existsSync(configPath)) {
//     throw new Error(
//       `Database configuration file not found at ${configPath}`
//     );
//   }

//   try {
//     const config = JSON.parse(readFileSync(configPath, 'utf-8'));

//     if (!config.DATABASE?.VALUE) {
//       throw new Error('Invalid config.json structure: DATABASE.VALUE not found');
//     }

//     const db = config.DATABASE.VALUE;

//     if (!db.HOST || !db.PORT || !db.USERNAME || !db.PASSWORD || !db.NAME) {
//       throw new Error('Invalid config.json: Missing required database credentials');
//     }

//     return {
//       host: db.HOST,
//       port: parseInt(String(db.PORT), 10),
//       user: db.USERNAME,
//       password: db.PASSWORD,
//       database: db.NAME,
//     };
//   } catch (error) {
//     if (error instanceof SyntaxError) {
//       throw new Error(`Failed to parse ${configPath}: Invalid JSON format`);
//     }
//     throw error;
//   }
// }


import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { env } from 'node:process';

export interface DatabaseCredentials {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export function getDatabaseCredentials(): DatabaseCredentials {
  const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } = env;

  if (DB_HOST && DB_PORT && DB_USER && DB_PASS && DB_NAME) {
    return {
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
    };
  }

  const configPath = join(env.NOMAD_TASK_DIR || '/local', 'config.json');

  if (!existsSync(configPath)) {
    throw new Error('Database credentials missing. Check Render environment variables.');
  }

  const config = JSON.parse(readFileSync(configPath, 'utf-8'));
  const db = config.DATABASE?.VALUE;

  if (!db?.HOST || !db?.PORT || !db?.USERNAME || !db?.PASSWORD || !db?.NAME) {
    throw new Error('Invalid database configuration.');
  }

  return {
    host: db.HOST,
    port: Number(db.PORT),
    user: db.USERNAME,
    password: db.PASSWORD,
    database: db.NAME,
  };
}
