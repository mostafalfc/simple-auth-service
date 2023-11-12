import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import configuration from './configuration';

export const createDBIfNotExists = async (): Promise<void> => {
  const db_options = configuration().database.type_orm_option;
  const options: TypeOrmModuleOptions = {
    type: 'postgres',
    host: db_options.host,
    port: db_options.port,
    username: db_options.username,
    password: db_options.password,
    entities: [],
    synchronize: true,
  };
  const data_source = new DataSource({
    type: 'postgres',
    ...options,
  });
  await data_source.initialize();
  const result = await data_source.query(
    `SELECT 1 FROM pg_database WHERE datname = '${db_options.database}'`,
  );
  if (!result.length) {
    console.log(`Creating database with name "${db_options.database}"`);
    await data_source.query(`CREATE DATABASE "${db_options.database}"`);
  }
  await data_source.destroy();
};
