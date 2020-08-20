import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import * as config from 'config';

const dbConfig = config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  logging: dbConfig.logging,
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'], // any file in src folder that ends with `.entity.ts`
  synchronize: dbConfig.synchronize, // not recommended for production setup
};
