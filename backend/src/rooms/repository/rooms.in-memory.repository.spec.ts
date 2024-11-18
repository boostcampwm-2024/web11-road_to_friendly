import { Test, TestingModule } from '@nestjs/testing';
import { RoomsInMemoryRepository } from './rooms.in-memory.repository';
import { PHASE } from '../../common/definition/phase';

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
      const roomId = repository.create();

      expect(roomId).toBe('mocked-uuid');
      expect(repository.isExistRoom(roomId)).toBe(true);
    });
  });

  describe('isExistRoom', () => {
    it('방이존재한다면 true를 반환한다', async () => {
      const roomId = repository.create();
      expect(repository.isExistRoom(roomId)).toBe(true);
    });

    it('방이존재하지 않으면 false를 반환한다', async () => {
      expect(repository.isExistRoom('undifined')).toBe(false);
    });
  });

  describe('join', () => {
    it('첫번쨰로 방에 접속한사람이 host가 된다.', async () => {
      const roomId = repository.create();
      const clientId = 'client1';

      const hostId = repository.setHostIfHostUndefined(roomId, clientId);
      expect(hostId).toBe(clientId);
      expect(repository.getHostId(roomId)).toBe(clientId);
    });

    it('나중에 방에 접속한사람이 host가 되지않아야 한다.', async () => {
      const roomId = repository.create();
      const firstClientId = 'client1';
      const secondClientId = 'client2';

      repository.setHostIfHostUndefined(roomId, firstClientId);
      const hostId = repository.setHostIfHostUndefined(roomId, secondClientId);

      expect(hostId).toBe(firstClientId); // 첫 번째 클라이언트가 호스트여야 함
      expect(repository.getHostId(roomId)).toBe(firstClientId);
    });
  });

  describe('changeRoomPhase', () => {
    it('방에 페이즈를 변경한다', async () => {
      const roomId = repository.create();

      repository.changeRoomPhase(roomId, PHASE.KEYWORD);

      const room = repository.isExistRoom(roomId);
      expect(room).toBe(true);
      expect(repository['rooms'].get(roomId).phase).toBe(PHASE.KEYWORD);
    });
  });

  describe('deleteRoom', () => {
    it('should delete a room if it exists', async () => {
      const roomId = repository.create();

      repository.deleteRoom(roomId);
      expect(repository.isExistRoom(roomId)).toBe(false);
    });
  });
});
