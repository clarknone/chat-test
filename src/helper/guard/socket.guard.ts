import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';
import { Observable } from 'rxjs';


export class JwtAuthSocketGuard extends AuthGuard('jwt-socket') {
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    return super.handleRequest(null, user || {}, {}, context, status);
  }
}
