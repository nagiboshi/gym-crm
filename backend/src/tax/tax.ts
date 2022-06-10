  import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Member} from '../member/member';
import {ClassSchedule} from '../class-schedule/class-schedule.model';

@Entity()
export class Tax {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', {scale: 2, transformer: {from: val => parseFloat(val), to: val => val}})
  value: number;

}
