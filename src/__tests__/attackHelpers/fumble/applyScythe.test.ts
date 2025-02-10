import { applyScythe } from '../../../helpers/fumble.ts';

const scytheDamageMock = 20;

describe('applyScythe method', ()=> {
  it('should return correct amount', ()=> {
    const scytheResult = applyScythe(scytheDamageMock);
    expect(scytheResult).toBe(21);
  });
});