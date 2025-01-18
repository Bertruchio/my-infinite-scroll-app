export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Мокаем CSS-модули
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Файлы для предварительной настройки
    modulePaths: ['<rootDir>/src/'], // Для сокращения путей импорта
};
