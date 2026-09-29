import { cancelDisconnectGrace, clearDisconnectGraceTimers, DISCONNECT_GRACE_MS, scheduleDisconnectGrace } from '../../sockets/reconnect.ts';

describe('disconnect grace period', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    clearDisconnectGraceTimers();
  });

  afterEach(() => {
    clearDisconnectGraceTimers();
    jest.useRealTimers();
  });

  it('runs disconnect cleanup only after the grace period', async () => {
    const onExpire = jest.fn(async () => undefined);
    scheduleDisconnectGrace('player-1', 'socket-1', onExpire);

    jest.advanceTimersByTime(DISCONNECT_GRACE_MS - 1);
    expect(onExpire).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);
    await Promise.resolve();
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('cancels stale cleanup when the player reconnects', () => {
    const onExpire = jest.fn(async () => undefined);
    scheduleDisconnectGrace('player-1', 'socket-1', onExpire);

    expect(cancelDisconnectGrace('player-1')).toBe(true);
    jest.advanceTimersByTime(DISCONNECT_GRACE_MS);
    expect(onExpire).not.toHaveBeenCalled();
  });
});
