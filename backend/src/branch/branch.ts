import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';
import {User} from '../user/user';

@Entity()
export class Branch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany( type => User, user => user.branches)
  users: User[]
}
