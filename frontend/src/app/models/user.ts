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



// @PrimaryGeneratedColumn()
// id: number;
//
// @Column()
// @IsNotEmpty()
// username: string;
//
// @Column()
// @IsNotEmpty()
// password: string;
//
// @Column()
// @IsNotEmpty()
// firstName: string;
//
// @Column()
// @IsNotEmpty()
// lastName: string;
//
// @Column()
// @IsNotEmpty()
// photoLink: string
//
// @Column({nullable: true})
// @IsMobilePhone()
// phoneNumber: string;
//
// @Column()
// @IsNotEmpty()
// role: UserRole;
//
//
// @OneToOne(() => Branch)
// @JoinColumn({referencedColumnName: "id", name: 'branchId'})
// branch: Branch;
//
// @Column({nullable: true})
// branchId: number;
