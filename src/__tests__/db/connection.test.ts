import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../../db/connection.ts';

jest.mock('mongoose', () => ({
  __esModule: true,
  default: {
    connect: jest.fn(),
    disconnect: jest.fn(),
  },
}));

describe('database connection', () => {
  const originalRoute = process.env.MONGODB_ROUTE;

  afterEach(async () => {
    await disconnectDatabase();
    jest.clearAllMocks();
    if (originalRoute === undefined) delete process.env.MONGODB_ROUTE;
    else process.env.MONGODB_ROUTE = originalRoute;
  });

  it('requires a MongoDB route', async () => {
    delete process.env.MONGODB_ROUTE;

    await expect(connectDatabase()).rejects.toThrow('MONGODB_ROUTE');
    expect(mongoose.connect).not.toHaveBeenCalled();
  });

  it('always selects the Kaotika database', async () => {
    process.env.MONGODB_ROUTE = 'mongodb://mongo.example:27017/?authSource=admin';

    await connectDatabase();

    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGODB_ROUTE, { dbName: 'Kaotika' });
  });
});
