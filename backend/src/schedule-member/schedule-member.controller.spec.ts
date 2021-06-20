import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleMemberController } from './schedule-member.controller';

describe('ScheduleMemberController', () => {
  let controller: ScheduleMemberController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduleMemberController],
    }).compile();

    controller = module.get<ScheduleMemberController>(ScheduleMemberController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
