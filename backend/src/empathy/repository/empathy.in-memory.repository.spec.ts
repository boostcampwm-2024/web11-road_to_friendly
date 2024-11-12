import { Test, TestingModule } from '@nestjs/testing';
import { EmpathyInMemoryRepository } from './empathy.in-memory.repository';

describe('EmpathyInMemoryRepository', () => {
  let repository: EmpathyInMemoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmpathyInMemoryRepository],
    }).compile();

    repository = module.get<EmpathyInMemoryRepository>(EmpathyInMemoryRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  test('같은 클라이언트일 경우 키워드는 중복 추가되지 않는다', async () => {
    // given
    const testRoomId = 'testRoomId';
    const testQuestionId = 1;
    const testKeyword = 'testKeyword';
    const testClient = 'testClient';

    // when
    await repository.addKeyword(testRoomId, testQuestionId, testKeyword, testClient);
    await repository.addKeyword(testRoomId, testQuestionId, testKeyword, testClient);
    await repository.addKeyword(testRoomId, testQuestionId, testKeyword, testClient);

    // then
    const statistics = repository.calculateStatistics(testRoomId);
    const clientStats = statistics.get(testClient);

    expect(clientStats.length).toBe(1);
    expect(clientStats[0].count).toBe(1);
    expect(clientStats[0].keyword).toBe(testKeyword);
  });

  test('다른 클라이언트가 같은 키워드를 입력하면 키워드 카운트는 증가한다', async () => {
    // given
    const testRoomId = 'testRoomId';
    const testQuestionId = 1;
    const testKeyword = 'testKeyword';

    const client1 = 'client1';
    const client2 = 'client2';
    const client3 = 'client3';

    // when
    await repository.addKeyword(testRoomId, testQuestionId, testKeyword, client1);
    await repository.addKeyword(testRoomId, testQuestionId, testKeyword, client2);
    await repository.addKeyword(testRoomId, testQuestionId, testKeyword, client3);

    // then
    const statistics = repository.calculateStatistics(testRoomId);

    const client1Stats = statistics.get(client1);
    const client2Stats = statistics.get(client2);
    const client3Stats = statistics.get(client3);

    const allClientStats = [client1Stats, client2Stats, client3Stats];

    allClientStats.forEach(clientStats => {
      expect(clientStats.length).toBe(1);
      expect(clientStats[0].keyword).toBe(testKeyword);
      expect(clientStats[0].count).toBe(allClientStats.length);
    });
  });

  test('같은 주제에 대해 여러 키워드를 입력한다', async () => {
    // given
    const testRoomId = 'testRoomId';
    const testQuestionId = 1;
    const testKeyword1 = 'testKeyword1';
    const testKeyword2 = 'testKeyword2';
    const testKeyword3 = 'testKeyword3';
    const testClient = 'testClient';

    // when
    await repository.addKeyword(testRoomId, testQuestionId, testKeyword1, testClient);
    await repository.addKeyword(testRoomId, testQuestionId, testKeyword2, testClient);
    await repository.addKeyword(testRoomId, testQuestionId, testKeyword3, testClient);

    // then
    const statistics = repository.calculateStatistics(testRoomId);
    const clientStats = statistics.get(testClient);

    expect(clientStats.length).toBe(3);
    expect(clientStats.every(clientStat => clientStat.questionId === testQuestionId))
      .toBe(true);
    expect(clientStats.map(clientStat => clientStat.keyword)).toEqual(
      expect.arrayContaining([testKeyword1, testKeyword2, testKeyword3]));
  });

  test('다른 주제에 대해 같은 키워드를 입력한다', async () => {
    // given
    const testRoomId = 'testRoomId';
    const testQuestionId1 = 1;
    const testQuestionId2 = 2;
    const testQuestionId3 = 3;
    const testKeyword = 'testKeyword';
    const testClient = 'testClient';

    // when
    await repository.addKeyword(testRoomId, testQuestionId1, testKeyword, testClient);
    await repository.addKeyword(testRoomId, testQuestionId2, testKeyword, testClient);
    await repository.addKeyword(testRoomId, testQuestionId3, testKeyword, testClient);

    // then
    const statistics = repository.calculateStatistics(testRoomId);
    const clientStats = statistics.get(testClient);

    expect(clientStats.length).toBe(3);
    expect(clientStats.every(clientStat => clientStat.keyword === testKeyword))
      .toBe(true);
    expect(clientStats.map(clientStat => clientStat.questionId)).toEqual(
      expect.arrayContaining([testQuestionId1, testQuestionId2, testQuestionId3]));
  });

  test('키워드를 제거한다', async () => {
    // given
    const testRoomId = 'testRoomId';
    const testQuestionId = 1;
    const testKeyword = 'testKeyword';
    const testClient = 'testClient';

    // when
    await repository.addKeyword(testRoomId, testQuestionId, testKeyword, testClient);
    await repository.removeKeyword(testRoomId, testQuestionId, testKeyword, testClient);

    // then
    const statistics = repository.calculateStatistics(testRoomId);
    expect(Array.from(statistics.keys()).length).toBe(0);
  });

  test('통계 산출과 동시에 기존 데이터는 삭제된다', async () => {
    // given
    const testRoomId = 'testRoomId';
    const testClient = 'testClient';

    // when
    await repository.addKeyword(testRoomId, 1, 'testKeyword', testClient);

    // then
    const statistics = repository.calculateStatistics(testRoomId);
    const clientStats = statistics.get(testClient);
    expect(clientStats.length).toBe(1);

    const repeatStatistics = repository.calculateStatistics(testRoomId);
    expect(Array.from(repeatStatistics.keys()).length).toBe(0);
  });
});
