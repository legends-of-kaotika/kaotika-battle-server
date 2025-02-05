import { Request, Response } from 'express';
import { initFetchPlayerController } from '../controllers/playerController';
import { initFetchPlayer } from '../services/playerService';
import { ONLINE_USERS_MOCK } from '../__mocks__/players';

jest.mock('../services/playerService', () => ({
  initFetchPlayer: jest.fn()
}));

jest.mock('../game', () => ({
  isGameStarted: false,
  ONLINE_USERS: []
}));

describe('Player Controller - initFetchPlayerController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    jest.resetModules(); // Resets the module registry
    jest.restoreAllMocks(); // Restores all mocks to their original implementations

    mockRequest = {
      params: { email: ONLINE_USERS_MOCK[0].email }
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  it('should successfully fetch and return player data', async () => {
    const mockPlayer = ONLINE_USERS_MOCK[0];
    (initFetchPlayer as jest.Mock).mockResolvedValue(mockPlayer);

    await initFetchPlayerController(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.send).toHaveBeenCalledWith({ status: 'OK', data: mockPlayer });
  });

  it('should return 400 if email parameter is missing', async () => {
    mockRequest.params = {};

    await initFetchPlayerController(mockRequest as Request,
      mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith({
      status: 'FAILED',
      data: { error: 'ERROR: Parameter :email cannot be empty' }
    });
  });

  it('should handle non-existent player', async () => {
    (initFetchPlayer as jest.Mock).mockResolvedValue(null);

    await initFetchPlayerController(mockRequest as Request,
    mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.send).toHaveBeenCalledWith({
      message: 'Does not exist any player with this email'
    });
  });

  it('should handle service errors', async () => {
    const mockError = new Error('Service error');
    (initFetchPlayer as jest.Mock).mockRejectedValue(mockError);

    await initFetchPlayerController(mockRequest as Request,
    mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalledWith({
      status: 'FAILED',
      message: 'ERROR while making the petition:',
      data: { error: mockError.message }
    });
  });
});