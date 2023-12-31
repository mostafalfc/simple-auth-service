export default () => ({
  app: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
  database: {
    mongo: process.env.MONGO_URL,
    postgres_url: process.env.POSTGRES_URL,
    type_orm_option: {
      migrations_table_name: 'migration',
      database: 'users',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      migrationsRun: true,
      logging: false,
      synchronize: true,
      type: 'postgres',
      entities: ['dist/**/entities/*.entity.js'],
      migrations: ['dist/migrations/*.js'],
      subscribers: ['dist/**/entities/*.entity.js'],
      autoLoadEntities: true,
    },
  },
  cache: {
    host: process.env.REDIS_HOST,
    port: +process.env.REDIS_PORT,
  },
  encryption: {
    jwt_secret: process.env.JWT_SECRET,
  },
  rate_limit: {
    limit: +process.env.RATE_LIMIT,
    ttl: +process.env.RATE_LIMIT_TTL,
  },
  rmq: {
    url: process.env.RMQ_URL ?? 'amqp://localhost:5672',
    queue: 'mails',
  },
});
