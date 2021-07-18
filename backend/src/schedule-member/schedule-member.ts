import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Member} from '../member/member';
import {ClassSchedule} from '../class-schedule/class-schedule.model';

@Entity()
export class ScheduleMember {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Member, )
  @JoinColumn({referencedColumnName: 'id', name: 'memberId'})
  member: Member;

  @Column()
  memberId: number;

  @Column({type: 'bigint'})
  scheduleDate: number;


  @ManyToOne(type => ClassSchedule)
  @JoinColumn({referencedColumnName: 'id', name: 'scheduleId'})
  schedule: ClassSchedule;

  @Column()
  scheduleId: number;
}
