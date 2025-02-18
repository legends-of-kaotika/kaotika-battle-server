import { getFairytaleDamage } from '../../../helpers/fumble.ts';

describe('fairytale method', ()=> {
  it('should add eruditoGlasses correctly', ()=> {
    const result = getFairytaleDamage();
    expect(result).toEqual({eruditoGlasses: true});
  });
});