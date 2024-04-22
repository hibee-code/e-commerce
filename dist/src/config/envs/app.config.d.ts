declare const _default: (() => {
    NODE_ENV: string;
    PROJECT_NAME: string;
    SERVER_URL: string;
    SERVER_HOST: string;
    SERVER_PORT: number;
    APP_KEY: string;
    JWT_SECRET: string;
    JWT_EXPIRY: string;
    HASH_SALT_ROUNDS: number;
    DEFAULT_USER_PASSWORD: string;
    API_ACCESS_TOKEN_EXPIRY: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    NODE_ENV: string;
    PROJECT_NAME: string;
    SERVER_URL: string;
    SERVER_HOST: string;
    SERVER_PORT: number;
    APP_KEY: string;
    JWT_SECRET: string;
    JWT_EXPIRY: string;
    HASH_SALT_ROUNDS: number;
    DEFAULT_USER_PASSWORD: string;
    API_ACCESS_TOKEN_EXPIRY: string;
}>;
export default _default;
