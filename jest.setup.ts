// Подключаем дополнительные матчеры для работы с DOM
import '@testing-library/jest-dom';

// Мокаем IntersectionObserver
class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | null = null;
    readonly rootMargin: string = '';
    readonly thresholds: ReadonlyArray<number> = [];

    constructor(public callback: IntersectionObserverCallback) {}

    observe(target: Element): void {
        // Вызываем callback с фиктивными данными
        this.callback([{ target, isIntersecting: true, intersectionRatio: 1 } as IntersectionObserverEntry], this);
    }

    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): IntersectionObserverEntry[] {
        return [];
    }
}

// Присваиваем мок глобальному объекту
global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

// Мокаем console.error, чтобы не засорять тесты
const originalError = console.error;
console.error = (...args: any[]) => {
    if (args[0]?.includes('act(...)')) {
        return; // Игнорируем предупреждения act()
    }
    originalError.call(console, ...args);
};
