declare global {
    namespace NodeJS {
        interface ProcessEnv {
            [key: string]: string | undefined;
            PORT: string;
            DATABASE_URL: string;
            AWS_S3_KEY: string;
            AWS_S3_SECRET: string;
        }
    }
}
