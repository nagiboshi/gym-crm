import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {IsMobilePhone, IsNotEmpty} from 'class-validator';
import {Branch} from '../branch/branch';


enum UserRole{
  ADMIN, ACCOUNTANT, OPERATOR
}

@Entity()
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


  @OneToOne(() => Branch)
  @JoinColumn()
  branch: Branch;
}
