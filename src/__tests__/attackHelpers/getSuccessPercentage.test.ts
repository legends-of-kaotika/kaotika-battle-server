import { getSuccessPercentage } from '../../helpers/attack.ts';

const playerBaseAttributesMock = 40;
const playerDexterityMock = 23; // Math.ceil(dex/3)= 8
const playerInsanityMock = 95;

describe ('getSuccessPercentage method', ()=> {
  it ('should return the correct successPercentage with specific weapon', ()=> {
    const successPercentage = getSuccessPercentage(playerBaseAttributesMock, playerDexterityMock, playerInsanityMock);
    expect(successPercentage).toBe(143);
  });
});