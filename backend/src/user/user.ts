import {Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique} from 'typeorm';
import {IsMobilePhone, IsNotEmpty} from 'class-validator';
import {Branch} from '../branch/branch';
import {JoinTable} from 'typeorm';


enum UserRole{
  ADMIN, ACCOUNTANT, OPERATOR
}

@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  username: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @Column()
  @IsNotEmpty()
  firstName: string;

  @Column()
  @IsNotEmpty()
  lastName: string;

  @Column()
  @IsNotEmpty()
  photoLink: string

  @Column({nullable: true})
  @IsMobilePhone()
  phoneNumber: string;

  @Column()
  @IsNotEmpty()
  role: UserRole;

  @ManyToMany(() => Branch, branch => branch.users, {nullable: true, eager: true} )
  @JoinTable()
  branches: Branch[];
}
