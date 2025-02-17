import { applyFairytaleDamage } from '../../../helpers/fumble.ts';

describe('fairytale method', ()=> {
  it('should add eruditoGlasses correctly', ()=> {
    const result = applyFairytaleDamage();
    expect(result).toEqual({eruditoGlasses: true});
  });
});