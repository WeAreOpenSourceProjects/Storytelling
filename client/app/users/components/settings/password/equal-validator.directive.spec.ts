import { EqualValidator } from './equal-validator.directive';

describe('EqualValidator', () => {
  it('should create an instance', () => {
    const directive = new EqualValidator('', '');
    expect(directive).toBeTruthy();
  });
});
