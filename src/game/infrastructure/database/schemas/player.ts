import { EntitySchema, types } from '@mikro-orm/core';
import Player from '../../../components/game/core/domain/Player';

interface IPlayer {
    id: Player['id'];
    name: Player['name'];
    score: Player['score'];
}

export default new EntitySchema<IPlayer>({
    // TODO: find a way to get rid of ts-ignore
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    class: Player,
    embeddable: true,
    properties: {
        id: { type: 'uuid' },
        name: { type: types.text, length: 100 },
        score: { type: types.smallint, unsigned: true }
    }
});