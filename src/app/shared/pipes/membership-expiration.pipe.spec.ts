import { MembershipExpirationPipe } from './membership-expiration.pipe';

describe('MembershipExpirationPipe', () => {
  it('create an instance', () => {
    const pipe = new MembershipExpirationPipe();
    expect(pipe).toBeTruthy();
  });
});
