import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class MembershipFreeze {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startDate: Date;

  @Column({  type: 'date', default: null,  nullable: true})
  endDate: Date;

  @Column({nullable: true})
  note: string;

  @Column({nullable: true})
  totalDays: number;
}
