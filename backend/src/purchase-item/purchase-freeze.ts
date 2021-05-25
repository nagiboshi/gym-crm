import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class PurchaseFreeze {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  start: Date;

  @Column({nullable: true})
  end: Date;
}
