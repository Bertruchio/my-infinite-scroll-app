class EventEmitter {
    #events = {};

    #getCallbacksFor(eventName) {
        return this.#events[eventName] ?? [];
    }

    #setCallbacksFor(eventName, events) {
        if (events.length === 0) {
            delete this.#events[eventName];
            return 0;
        }
        this.#events[eventName] = events;
    }

    /**
     * Регистрирует обработчик для события.
     * @param {string} eventName - Имя события.
     * @param {Function} listener - Функция-обработчик.
     */
    on(eventName, listener) {
        const subs = this.#getCallbacksFor(eventName);
        subs.push(listener);
        this.#setCallbacksFor(eventName, subs);
    }

    /**
     * Вызывает обработчики для указанного события.
     * @param {string} eventName - Имя события.
     * @param {...any} args - Аргументы, передаваемые обработчикам.
     */
    emit(eventName, ...args) {
        this.#getCallbacksFor(eventName)
            .forEach((listener) => {listener(...args)});
    }

    /**
     * Удаляет обработчик для указанного события.
     * @param {string} eventName - Имя события.
     * @param {Function} listener - Функция-обработчик.
     */
    off(eventName, listener) {
        const subs = this.#getCallbacksFor(eventName)
            .filter((item) => item !== listener);

        this.#setCallbacksFor(eventName, subs);
    }
}

const emitter = new EventEmitter();

const logData = (data) => console.log(`Данные: ${data.message}`);

emitter.on('data', logData);

console.log('Испускание события "data"');
emitter.emit('data', { message: 'Hello, world!' });

console.log('Удаление обработчика события "data"');
emitter.off('data', logData);

console.log('Попытка повторного испускания события "data"');
emitter.emit('data', { message: 'This should not appear' });
