import { LocalImageLinkPipe } from './member-photo-link.pipe';

describe('MemberPhotoLinkPipe', () => {
  it('create an instance', () => {
    const pipe = new LocalImageLinkPipe();
    expect(pipe).toBeTruthy();
  });
});
