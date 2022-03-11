import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Member} from '../member/member';
import {ClassSchedule} from '../class-schedule/class-schedule.model';


export const ScheduleMemberFields = {
  id: 'id',
  member: 'member',
  memberId:'memberId',
  scheduleDate: 'scheduleDate',
  schedule: 'schedule',
  scheduleId: 'scheduleId'
}

@Entity()
export class ScheduleMember {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Member, {onDelete: "CASCADE"} )
  @JoinColumn({referencedColumnName: 'id', name: 'memberId'})
  member: Member;

  @Column()
  memberId: number;

  @Column()
  scheduleDate: Date;

  @ManyToOne(type => ClassSchedule, {onDelete: "CASCADE"})
  @JoinColumn({referencedColumnName: 'id', name: 'scheduleId'})
  schedule: ClassSchedule;

  @Column()
  scheduleId: number;
}
