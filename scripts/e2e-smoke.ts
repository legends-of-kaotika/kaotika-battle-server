import { io, Socket } from 'socket.io-client';

interface Ack {
  status: 'OK' | 'FAILED';
  error?: string;
  state?: unknown;
  player?: unknown;
}

const serverUrl = process.env.E2E_SERVER_URL || 'http://localhost:3000';
const webToken = process.env.WEB_SOCKET_TOKEN || 'development-e2e-web-token';

const connectOnce = (auth: Record<string, string>): Promise<Socket> => new Promise((resolve, reject) => {
  const socket = io(serverUrl, {
    auth,
    transports: ['websocket'],
    reconnection: false,
    timeout: 5000,
  });
  socket.once('connect', () => resolve(socket));
  socket.once('connect_error', (error) => {
    socket.disconnect();
    reject(error);
  });
});

const connect = async (auth: Record<string, string> = {}): Promise<Socket> => {
  let lastError: unknown;
  for (let attempt = 0; attempt < 10; attempt++) {
    try {
      return await connectOnce(auth);
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  throw lastError;
};

const emitAck = (socket: Socket, event: string, ...args: unknown[]): Promise<Ack> => new Promise((resolve, reject) => {
  socket.timeout(5000).emit(event, ...args, (error: Error | null, response: Ack) => {
    if (error) reject(error);
    else resolve(response);
  });
});

const expectStatus = (response: Ack, status: Ack['status'], step: string): void => {
  if (response?.status !== status) {
    throw new Error(`${step}: expected ${status}, received ${response?.status || 'no response'} (${response?.error || 'no error'})`);
  }
};

const sockets: Socket[] = [];

try {
  const invalidWeb = await connect({ webToken: `${webToken}-invalid` });
  sockets.push(invalidWeb);
  expectStatus(await emitAck(invalidWeb, 'web-sendSocketId'), 'FAILED', 'invalid web token');
  invalidWeb.disconnect();

  const web = await connect({ webToken });
  sockets.push(web);
  const registration = await emitAck(web, 'web-sendSocketId');
  expectStatus(registration, 'OK', 'web registration');
  if (!registration.state || typeof registration.state !== 'object') {
    throw new Error('web registration: authoritative state snapshot is missing');
  }

  const duplicateWeb = await connect({ webToken });
  sockets.push(duplicateWeb);
  expectStatus(await emitAck(duplicateWeb, 'web-sendSocketId'), 'FAILED', 'duplicate web registration');

  const unauthenticatedMobile = await connect();
  sockets.push(unauthenticatedMobile);
  const unauthenticatedSignIn = await emitAck(unauthenticatedMobile, 'mobile-signIn', 'nobody@example.com');
  expectStatus(unauthenticatedSignIn, 'FAILED', 'missing Firebase token');
  unauthenticatedMobile.disconnect();

  const invalidFirebaseMobile = await connect({ idToken: 'invalid-firebase-token' });
  sockets.push(invalidFirebaseMobile);
  const invalidFirebaseSignIn = await emitAck(invalidFirebaseMobile, 'mobile-signIn', 'nobody@example.com');
  expectStatus(invalidFirebaseSignIn, 'FAILED', 'invalid Firebase token');
  invalidFirebaseMobile.disconnect();

  const firebaseToken = process.env.FIREBASE_ID_TOKEN;
  const firebaseEmail = process.env.FIREBASE_EMAIL;
  if (firebaseToken && firebaseEmail) {
    const mobile = await connect({ idToken: firebaseToken });
    sockets.push(mobile);
    expectStatus(await emitAck(mobile, 'mobile-signIn', firebaseEmail), 'OK', 'Firebase sign-in');
  }

  web.disconnect();
  await new Promise((resolve) => setTimeout(resolve, 100));
  expectStatus(await emitAck(duplicateWeb, 'web-sendSocketId'), 'OK', 'web takeover after disconnect');

  console.log(`E2E smoke passed against ${serverUrl}${firebaseToken && firebaseEmail ? ' with Firebase sign-in' : ''}.`);
} finally {
  sockets.forEach((socket) => socket.disconnect());
}
