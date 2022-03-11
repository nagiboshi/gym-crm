import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {ClassModel} from '../classes/class-model';
import {Branch} from '../branch/branch';
import {ScheduleMember} from '../schedule-member/schedule-member';
import {Type} from 'class-transformer';

export const ClassScheduleFields = {
  id: 'id',
  scheduleClass: 'scheduleClass',
  classId: 'classId',
  timeStart: 'timeStart',
  timeEnd: 'timeEnd',
  day: 'day',
  capacity: 'capacity',
  scheduleFrom: 'scheduleFrom',
  sheduleUntil: 'scheduleUntil',
  signedMembers: 'signedMembers',
  branch: 'branch',
  branchId: 'branchId'
}
@Entity()
export class ClassSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => ClassModel, {onDelete:"CASCADE"})
  @JoinColumn({referencedColumnName: 'id', name: 'classId'})
  scheduleClass: ClassModel;

  @Column()
  classId: number;

  @Column()
  timeStart: number;

  @Column()
  timeEnd: number;

  @Column({type: 'smallint'})
  day: number;

  @Column({type: 'smallint'})
  capacity: number;

  @Type(() => Date)
  @Column()
  scheduleFrom: Date;

  @Type(() => Date)
  @Column()
  scheduleUntil: Date;

  @OneToMany(type => ScheduleMember,  scheduleMember => scheduleMember.schedule, {nullable: true})
  signedMembers?: ScheduleMember[];

  @ManyToOne(type => Branch, {nullable: true})
  branch: Branch;

  @Column({nullable: true})
  branchId: number;
}
