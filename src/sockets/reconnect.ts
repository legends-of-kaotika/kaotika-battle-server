export const DISCONNECT_GRACE_MS = 10000;

interface PendingDisconnect {
  socketId: string;
  timeout: NodeJS.Timeout;
}

const pendingDisconnects = new Map<string, PendingDisconnect>();

export const cancelDisconnectGrace = (playerId: string): boolean => {
  const pending = pendingDisconnects.get(playerId);
  if (!pending) return false;
  clearTimeout(pending.timeout);
  pendingDisconnects.delete(playerId);
  return true;
};

export const scheduleDisconnectGrace = (playerId: string, socketId: string,
  onExpire: () => Promise<void>): void => {
  cancelDisconnectGrace(playerId);
  const timeout = setTimeout(() => {
    const pending = pendingDisconnects.get(playerId);
    if (!pending || pending.socketId !== socketId) return;
    pendingDisconnects.delete(playerId);
    void onExpire().catch((error) => console.error('Disconnect grace handler failed:', error));
  }, DISCONNECT_GRACE_MS);
  timeout.unref();
  pendingDisconnects.set(playerId, { socketId, timeout });
};

export const clearDisconnectGraceTimers = (): void => {
  for (const pending of pendingDisconnects.values()) clearTimeout(pending.timeout);
  pendingDisconnects.clear();
};
