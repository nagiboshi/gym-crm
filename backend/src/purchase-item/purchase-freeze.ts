import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class PurchaseFreeze {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'bigint'})
  startDate: bigint;

  @Column({nullable: true, type: 'bigint'})
  endDate: bigint;

  @Column({nullable: true})
  note: string;

  @Column({nullable: true})
  totalDays: number;
}
