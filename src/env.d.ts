/// <reference types="@cloudflare/workers-types" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB: D1Database;
      [key: string]: string | undefined | D1Database;
    }
  }
}

export {};
