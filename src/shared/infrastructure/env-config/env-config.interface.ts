export interface EnvConfig {
  getPort(): number;
  getNodeEnv(): string;
  getJwtSecret(): string;
  getJwtExpiresInSeconds(): number;
}
