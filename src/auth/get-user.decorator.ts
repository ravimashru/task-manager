import { createParamDecorator } from '@nestjs/common';
import { User } from './user.entity';

export const GetUser = createParamDecorator((data, req): User => {
  // TODO: check nestjs documentation for the right way to create decorators
  return req.args[0].user;
});
