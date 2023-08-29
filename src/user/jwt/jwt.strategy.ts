import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { User } from '../schemas/user.schemas';
import { UserService } from '../user.service';
import { JwtPayload } from './jwt-payload.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({ jwtFromRequest: userService.returnJwtExtractor(), ignoreExpiration: false, secretOrKey: process.env.JWT_SECRET })
  }

  async validate(jwtPayload: JwtPayload): Promise<User> {
    const user = await this.userService.validateUser(jwtPayload)
    if (!user) {
      throw new UnauthorizedException()
    }
    return user
  }
}
