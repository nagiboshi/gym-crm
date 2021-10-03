import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {ClassModel} from '../classes/class-model';
import {Branch} from '../branch/branch';
import {ScheduleMember} from '../schedule-member/schedule-member';


@Entity()
export class ClassSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => ClassModel, {onDelete:"CASCADE"})
  @JoinColumn({referencedColumnName: 'id', name: 'classId'})
  scheduleClass;

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

  @Column({type: 'bigint'})
  scheduleFrom: number;

  @Column({type: 'bigint'})
  scheduleUntil: number;

  @OneToMany(type => ScheduleMember,  scheduleMember => scheduleMember.schedule, {nullable: true})
  signedMembers?: ScheduleMember[];

  @ManyToOne(type => Branch, {nullable: true})
  branch: Branch;

  @Column({nullable: true})
  branchId: number;
}
