import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { FieldMarkedCellPositionChangedEvent } from '../../core/domain/events';
import { ServerSentEvents } from '../../../../../../packages/server-sent-events';
import { Message } from '../../../../../../packages/message-bus';
import { FieldMarkedCellPositionChangedDTO } from './dtos';

@Controller()
export class FieldMarkedCellPositionChangedListener {
    constructor(private serverSentEvents: ServerSentEvents) {}

    @EventPattern(FieldMarkedCellPositionChangedEvent.type)
    async handle(message: Message) {
        const data =
            message.value as unknown as FieldMarkedCellPositionChangedDTO;

        const event = new FieldMarkedCellPositionChangedEvent(
            data.id,
            data.newMarkedCellPosition,
            data.matchId,
            data.fieldId
        );

        await this.serverSentEvents.broadсast(event.matchId, event);
    }
}
