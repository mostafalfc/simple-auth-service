import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import configuration from './configuration';

dotenvConfig({ path: '.env' });

const config = configuration().database.type_orm_option;

export const connectionSource = new DataSource(config as DataSourceOptions);
