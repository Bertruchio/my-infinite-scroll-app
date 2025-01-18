// List.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { List } from '../components/List.tsx';
import { listStore } from '../stores/listStore';

jest.mock('../stores/listStore');

describe('Компонент List', () => {
    test('отображает состояние загрузки', () => {
        listStore.loading = true;
        render(<List />);
        expect(screen.getByText('Загрузка данных...')).toBeInTheDocument();
    });

    test('отображает элементы после загрузки данных', async () => {
        listStore.loading = false;
        listStore.items = [{ id: '1', name: 'Элемент 1', description: 'Описание 1' }];
        render(<List />);

        await waitFor(() => {
            expect(screen.getByText('Элемент 1')).toBeInTheDocument();
        });
    });

    test('изменяет порядок сортировки при нажатии на кнопку сортировки', async () => {
        render(<List />);
        fireEvent.click(screen.getByText('Звёзды'));
        await waitFor(() => {
            expect(listStore.fetchItems).toHaveBeenCalledWith('stars', 'desc');
        });
    });
});
