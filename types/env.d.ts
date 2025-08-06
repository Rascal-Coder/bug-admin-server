// generate by ./scripts/generateEnvTypes.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_PORT: '8001';
      DB_HOST: '127.0.0.1';
      DB_PORT: '13307';
      DB_DATABASE: 'bug_admin';
      DB_USERNAME: 'root';
      DB_PASSWORD: 'root';
      DB_SYNCHRONIZE: 'true';
      DB_LOGGING: '["error"]';
      REDIS_PORT: '6379';
      REDIS_HOST: '127.0.0.1';
      REDIS_PASSWORD: '123456';
      REDIS_DB: '0';
    }
  }
}
export {};
