import {Token} from '@shared/user.service';
import {Branch} from '@models/branch';


export class User {
  id: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  photoLink?: string;
  token?: Token;
  branches: Branch[];
  role: String;
}

export interface UserToken {
  branches:   Branch[];
  username: string;
  photoLink: string;
  exp: number;
  firstName: string;
  lastName:string;
  iat:number;
  id: number;
}
