import { MaskedAccountPipe } from './masked-account.pipe';

describe('MaskedAccountPipe', () => {
  it('create an instance', () => {
    const pipe = new MaskedAccountPipe();
    expect(pipe).toBeTruthy();
  });
});
