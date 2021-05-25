import {Injectable} from '@nestjs/common';
import {UserService} from '../user/user.service';
import * as bcrypt from 'bcrypt';
import {JwtService} from '@nestjs/jwt';
@Injectable()
export class AuthService {


  constructor(private userService: UserService,
              private jwtService: JwtService) {
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOne({where: {username}});
    if( user ) {
      const isValidUser = await bcrypt.compare(pass, user.password);
      if (isValidUser) {
        const {password, ...result} = user;
        return result;
      }
    }
    return null;
  }
}
