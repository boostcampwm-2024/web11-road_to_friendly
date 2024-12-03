import { Test, TestingModule } from '@nestjs/testing';

import { RoomsInMemoryRepository } from './rooms.in-memory.repository';

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
    it('방이 존재한다면 true를 반환한다', async () => {
      const roomId = await repository.create();
      expect(await repository.isExistRoom(roomId)).toBe(true);
    });

    it('방이 존재하지 않으면 false를 반환한다', async () => {
      expect(await repository.isExistRoom('undifined')).toBe(false);
    });
  });

  describe('join', () => {
    it('첫번쨰로 방에 접속한 사람이 host가 된다.', async () => {
      const roomId = await repository.create();
      const clientId = 'client1';

      const hostId = await repository.setHostIfHostUndefined(roomId, clientId);
      expect(hostId).toBe(clientId);
      expect(await repository.getHostId(roomId)).toBe(clientId);
    });

    it('나중에 방에 접속한사람은 host가 되지 않아야 한다.', async () => {
      const roomId = await repository.create();
      const firstClientId = 'client1';
      const secondClientId = 'client2';

      await repository.setHostIfHostUndefined(roomId, firstClientId);
      const hostId = await repository.setHostIfHostUndefined(roomId, secondClientId);

      expect(hostId).toBe(firstClientId); // 첫 번째 클라이언트가 호스트여야 함
      expect(await repository.getHostId(roomId)).toBe(firstClientId);
    });
  });

  describe('deleteRoom', () => {
    it('방이 존재하지 않으면 삭제되어야 한다.', async () => {
      const roomId = await repository.create();

      repository.deleteRoom(roomId);
      expect(await repository.isExistRoom(roomId)).toBe(false);
    });
  });

  describe('updateHost', () => {
    it('호스트가 나가면 다른 참여자가 호스트가 되어야한다.', async () => {
      const roomId = await repository.create();
      const firstClientId = 'client1';
      const secondClientId = 'client2';

      const hostId = await repository.setHostIfHostUndefined(roomId, firstClientId);
      expect(hostId).toBe(firstClientId);

      await repository.updateHost(roomId, secondClientId);

      expect(await repository.getHostId(roomId)).toBe(secondClientId);
    });
  });
});
