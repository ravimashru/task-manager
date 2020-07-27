import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  logging: true,
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'taskmanagement',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'], // any file in src folder that ends with `.entity.ts`
  synchronize: true // not recommended for production setup
};
