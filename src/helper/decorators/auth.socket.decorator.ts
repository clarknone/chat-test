import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetSocketUser = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToWs().getClient();
    return request.user;
  },
);
