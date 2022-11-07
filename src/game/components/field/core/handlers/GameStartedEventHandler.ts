import { randomUUID } from 'node:crypto';
import { EntityManager } from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';
import Field from '../domain/Field';
import GameStartedEvent from '../../../game/core/domain/events/GameStartedEvent';
import Session from '../../../../shared/Session';
import { FIELD_SIZE } from '../../../../shared/constants';

@Injectable()
export default class GameStartedEventHandler {
    constructor(private em: EntityManager) {}

    async handle(event: GameStartedEvent): Promise<void> {
        const session = Session.create(event.minutesToPlay, event.startedAt);

        const field = Field.create(
            randomUUID(),
            event.playersId,
            event.gameId,
            FIELD_SIZE,
            session
        );

        const fieldRepository = this.em.getRepository(Field);

        await fieldRepository.persistAndFlush(field);
    }
}