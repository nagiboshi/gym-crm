import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Member} from '../member/member';
import {ClassSchedule} from '../class-schedule/class-schedule.model';

@Entity()
export class ScheduleMember {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(type => Member)
  @JoinColumn({referencedColumnName: 'id', name: 'memberId'})
  member: Member;

  @Column()
  memberId: number;

  @Column({type: 'bigint'})
  scheduleDate: number;


  @OneToOne(type => ClassSchedule)
  @JoinColumn({referencedColumnName: 'id', name: 'scheduleId'})
  schedule: ClassSchedule;

  @Column()
  scheduleId: number;
}
