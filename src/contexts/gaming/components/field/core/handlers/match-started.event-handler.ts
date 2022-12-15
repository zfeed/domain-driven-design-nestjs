import { randomUUID } from 'node:crypto';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Field } from '../domain/field';
import { MatchStartedEvent } from '../../../match/core/domain/events';
import { FIELD_SIZE } from '../constants';

@Injectable()
export class MatchStartedEventHandler {
    constructor(private em: EntityManager) {}

    async handle(event: MatchStartedEvent): Promise<void> {
        const field = Field.create(
            randomUUID(),
            event.playersId,
            event.matchId,
            FIELD_SIZE,
            new Date()
        );

        const fieldRepository = this.em.getRepository(Field);

        await fieldRepository.persistAndFlush(field);
    }
}
