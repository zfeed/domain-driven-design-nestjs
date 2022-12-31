export interface Event {
    id: string;
    type: string;
}

const EVENTS = Symbol('events');

class Entity<E extends Event> {
    private [EVENTS]!: E[];

    get events(): ReadonlyArray<E> {
        // eslint-disable-next-line no-underscore-dangle
        return this[EVENTS] || [];
    }

    // eslint-disable-next-line no-useless-constructor
    protected constructor(readonly id: string) {
        Object.defineProperty(this, EVENTS, {
            value: [],
            writable: true,
            enumerable: false
        });
    }

    protected pushEvent(event: E) {
        // We use MikroORM. It doesn't creates instances by Object.create
        // so setting default value "_event = []" doesn't work
        // It's possible to pass forceCOnstructor: true, but it produces many more bugs
        // eslint-disable-next-line no-underscore-dangle
        if (this[EVENTS] === undefined) {
            // eslint-disable-next-line no-underscore-dangle
            this[EVENTS] = [];
        }

        // eslint-disable-next-line no-underscore-dangle
        this[EVENTS].push(event);
    }
}

export { Entity };
