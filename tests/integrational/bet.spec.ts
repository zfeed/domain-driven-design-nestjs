import { MikroORM } from '@mikro-orm/core';
import { TestingModule } from '@nestjs/testing';
import { EntityManager } from '@mikro-orm/sqlite';
import BetService from '../../src/bet/core/services/BetService/BetService';
import Bet from '../../src/bet/core/domain/bet/Bet';
import Status from '../../src/bet/core/domain/bet/Status';
import GameStartedEvent from '../../src/game/core/domain/game/GameStartedEvent';
import GameFinishedEvent from '../../src/game/core/domain/game/GameFinishedEvent';
import * as database from '../database';

let moduleRef: TestingModule;

beforeAll(async () => {
    moduleRef = await database.createTestingModule(BetService);
});

afterAll(async () => {
    const mikroorm = await moduleRef.resolve(MikroORM);
    await mikroorm.close();
});

beforeEach(async () => database.initialize());

describe('Bet', () => {
    test('Bet is created', async () => {
        const betService = await moduleRef.resolve(BetService);

        await betService.handleGameStartedEvent(
            new GameStartedEvent(1, new Date(), 'game-id-1', [
                'player-id-1',
                'player-id-2'
            ])
        );

        const em = await moduleRef.resolve(EntityManager);
        const betRepository = em.getRepository(Bet);

        // assert database state
        const bets = await betRepository.findAll();
        expect(bets[0]!.id).toStrictEqual(expect.any(String));
        expect(bets[0]!.gameId).toBe('game-id-1');
        expect(bets[0]!.getWinnerPlayerId()).toBe(null);
        expect(bets[0]!.amount).toStrictEqual(0);
        expect(bets[0]!.getStatus()).toEqual(Status.create(Status.code.ACTIVE));
        expect(bets[0]!.playerIds).toEqual(['player-id-1', 'player-id-2']);
    });

    test('Bet is finished', async () => {
        const betService = await moduleRef.resolve(BetService);

        await betService.handleGameStartedEvent(
            new GameStartedEvent(1, new Date(), 'game-id-1', [
                'player-id-1',
                'player-id-2'
            ])
        );

        await betService.handleGameFinishedEvent(
            new GameFinishedEvent(
                2,
                new Date(),
                'game-id-1',
                [
                    {
                        id: 'player-id-1',
                        score: 0
                    },
                    {
                        id: 'player-id-2',
                        score: 0
                    }
                ],
                new Date()
            )
        );

        const em = await moduleRef.resolve(EntityManager);
        const betRepository = em.getRepository(Bet);

        // assert database state
        const bets = await betRepository.findAll();
        expect(bets[0]!.id).toStrictEqual(expect.any(String));
        expect(bets[0]!.gameId).toBe('game-id-1');
        expect(bets[0]!.getWinnerPlayerId()).toBeOneOf([
            'player-id-1',
            'player-id-2'
        ]);
        expect(bets[0]!.getStatus()).toEqual(
            Status.create(Status.code.FINISHED)
        );
        expect(bets[0]!.playerIds).toEqual(['player-id-1', 'player-id-2']);
    });
});