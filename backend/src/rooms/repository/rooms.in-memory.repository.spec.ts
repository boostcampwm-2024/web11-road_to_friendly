import { Test, TestingModule } from '@nestjs/testing';
import { RoomPhase, RoomsInMemoryRepository } from './rooms.in-memory.repository';
import { v4 as uuid } from 'uuid';

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mocked-uuid'),
}));

describe('RoomsGateway', () => {
  let repository: RoomsInMemoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomsInMemoryRepository],
    }).compile();

    repository = module.get<RoomsInMemoryRepository>(RoomsInMemoryRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('create는 roomId를 반환한다', async () => {
      const roomId = await repository.create();

      expect(roomId).toBe('mocked-uuid');
      expect(await repository.isExistRoom(roomId)).toBe(true);
    });
  });

  describe('isExistRoom', () => {
    it('방이존재한다면 true를 반환한다', async () => {
      const roomId = await repository.create();
      expect(await repository.isExistRoom(roomId)).toBe(true);
    });

    it('방이존재하지 않으면 false를 반환한다', async () => {
      expect(await repository.isExistRoom('undifined')).toBe(false);
    });
  });

  describe('join', () => {
    it('첫번쨰로 방에 접속한사람이 host가 된다.', async () => {
      const roomId = await repository.create();
      const clientId = 'client1';

      const hostId = await repository.join(roomId, clientId);
      expect(hostId).toBe(clientId);
      expect(await repository.isHost(roomId)).toBe(clientId);
    });

    it('나중에 방에 접속한사람이 host가 되지않아야 한다.', async () => {
      const roomId = await repository.create();
      const firstClientId = 'client1';
      const secondClientId = 'client2';

      await repository.join(roomId, firstClientId);
      const hostId = await repository.join(roomId, secondClientId);

      expect(hostId).toBe(firstClientId); // 첫 번째 클라이언트가 호스트여야 함
      expect(await repository.isHost(roomId)).toBe(firstClientId);
    });
  });

  describe('changeRoomPhase', () => {
    it('방에 페이즈를 변경한다', async () => {
      const roomId = await repository.create();

      await repository.changeRoomPhase(roomId, RoomPhase.IN_PROGRESS);

      const room = await repository.isExistRoom(roomId);
      expect(room).toBe(true);
      expect(await repository['rooms'].get(roomId).phase).toBe(RoomPhase.IN_PROGRESS);
    });
  });

  describe('deleteRoom', () => {
    it('should delete a room if it exists', async () => {
      const roomId = await repository.create();

      await repository.deleteRoom(roomId);
      expect(await repository.isExistRoom(roomId)).toBe(false);
    });
  });
});
