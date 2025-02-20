import { sleep } from '../../helpers/utils.ts';

jest.useFakeTimers();

describe('sleep function', () => {
  it('should resolve after the specified time', async () => {
    const ms = 1000;
    const promise = sleep(ms);

    // Avanza el temporizador de Jest
    jest.advanceTimersByTime(ms);

    await expect(promise).resolves.toBeUndefined();
  });

  it('should call setTimeout with the correct arguments', () => {
    const ms = 1000;
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
  
    sleep(ms);
  
    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), ms);
  });
  
});
