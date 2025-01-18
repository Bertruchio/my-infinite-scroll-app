import { render, screen } from '@testing-library/react';
import { Loader } from '../components/Loader.tsx';

describe('Компонент Loader', () => {
    test('отображает индикатор загрузки с текстом "Загрузка данных..."', () => {
        render(<Loader />);
        expect(screen.getByText('Загрузка данных...')).toBeInTheDocument();
        expect(screen.getByRole('status')).toBeInTheDocument();
    });
});
