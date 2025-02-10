import { ONLINE_USERS_MOCK } from '../../../__mocks__/players.ts';
import { applyFairytale } from '../../../helpers/fumble.ts';

const playerMock = {...ONLINE_USERS_MOCK[0]};

describe('fairytale method', ()=> {
  it('should add eruditoGlasses correctly', ()=> {
    applyFairytale(playerMock);
    expect(playerMock.eruditoGlasses).toBe(true);
  });
});