export const appConfig = () => ({
  application: {
    port: process.env.PORT || 3030,
    environment: process.env.APP_ENVIRONMENT,
    nodeEnv: process.env.NODE_ENV,
  },
  postgres: {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiration: process.env.JWT_EXPIRATION_TIME_HOUR
  },
});

export type AppConfigType = ReturnType<typeof appConfig>;
