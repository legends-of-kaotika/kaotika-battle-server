var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { initFetchPlayerController } from '../../controllers/playerController.ts';
import { initFetchPlayer } from '../../services/playerService.ts';
import { ONLINE_USERS_MOCK } from '../../__mocks__/players.ts';
jest.mock('../../services/playerService', () => ({
    initFetchPlayer: jest.fn()
}));
jest.mock('../../game', () => ({
    isGameStarted: false,
    ONLINE_USERS: []
}));
describe('Player Controller - initFetchPlayerController', () => {
    let mockRequest;
    let mockResponse;
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
    it('should successfully fetch and return player data', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockPlayer = ONLINE_USERS_MOCK[0];
        initFetchPlayer.mockResolvedValue(mockPlayer);
        yield initFetchPlayerController(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.send).toHaveBeenCalledWith({ status: 'OK', data: mockPlayer });
    }));
    it('should return 400 if email parameter is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        mockRequest.params = {};
        yield initFetchPlayerController(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.send).toHaveBeenCalledWith({
            status: 'FAILED',
            data: { error: 'ERROR: Parameter :email cannot be empty' }
        });
    }));
    it('should handle non-existent player', () => __awaiter(void 0, void 0, void 0, function* () {
        initFetchPlayer.mockResolvedValue(null);
        yield initFetchPlayerController(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.send).toHaveBeenCalledWith({
            message: 'Does not exist any player with this email'
        });
    }));
    it('should handle service errors', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockError = new Error('Service error');
        initFetchPlayer.mockRejectedValue(mockError);
        yield initFetchPlayerController(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.send).toHaveBeenCalledWith({
            status: 'FAILED',
            message: 'ERROR while making the petition:',
            data: { error: mockError.message }
        });
    }));
});
