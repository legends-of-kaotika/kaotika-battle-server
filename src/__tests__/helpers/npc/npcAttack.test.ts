import { setTarget } from '../../../game.ts';
import { attackFlow } from '../../../helpers/game.ts';
import { npcAttack, selectKaotikaPlayerRandom } from '../../../helpers/npc.ts';
import { sleep } from '../../../helpers/utils.ts';
import { sendSelectedPlayerIdToWeb } from '../../../sockets/emits/user.ts';
import { io } from '../../../../index.ts';

// Mockea cada dependencia en función de su ruta real
jest.mock('../../../helpers/utils.ts', () => ({
  sleep: jest.fn(() => Promise.resolve()),
  logUnlessTesting: jest.fn(),
}));

jest.mock('../../../game.ts', () => ({
  setTarget: jest.fn(),
}));

jest.mock('../../../helpers/game.ts', () => ({
  attackFlow: jest.fn(),
}));

jest.mock('../../../sockets/emits/user.ts', () => ({
  sendSelectedPlayerIdToWeb: jest.fn(),
}));


describe('npcAttack', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe ejecutar el flujo de ataque cuando se selecciona un jugador', async () => {

    // Configura el mock para que retorne un jugador simulado
    const fakePlayer = { _id: 'player123', nickname: 'TestPlayer' };

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    jest.spyOn(require('../../../helpers/npc'), 'selectKaotikaPlayerRandom').mockReturnValue(fakePlayer);

    // Ejecuta la función
    await npcAttack();

    // Verifica que se llamen las funciones con los parámetros esperados
    expect(sleep).toHaveBeenNthCalledWith(1, 2000);
    expect(sleep).toHaveBeenNthCalledWith(2, 3000);
    expect(setTarget).toHaveBeenCalledWith(fakePlayer);
    expect(sendSelectedPlayerIdToWeb).toHaveBeenCalledWith(io, fakePlayer);
    expect(attackFlow).toHaveBeenCalledWith(fakePlayer._id);
  });

  it('no debe ejecutar el ataque si no se selecciona ningún jugador', async () => {
    // Configura el mock para que retorne null

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    jest.spyOn(require('../../../helpers/npc'), 'selectKaotikaPlayerRandom').mockReturnValue(null);
    selectKaotikaPlayerRandom();

    await npcAttack();

    // Verifica que no se llamen las funciones relacionadas con el ataque
    expect(setTarget).not.toHaveBeenCalled();
    expect(sendSelectedPlayerIdToWeb).not.toHaveBeenCalled();
    expect(attackFlow).not.toHaveBeenCalled();
  });
});
