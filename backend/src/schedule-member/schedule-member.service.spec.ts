import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleMemberService } from './schedule-member.service';

describe('ScheduleMemberService', () => {
  let service: ScheduleMemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduleMemberService],
    }).compile();

    service = module.get<ScheduleMemberService>(ScheduleMemberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
