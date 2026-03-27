declare module "bun" {
  interface Env {
    readonly TURSO_DATABASE_URL: string;
    readonly TURSO_AUTH_TOKEN: string;
  }
}