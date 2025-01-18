import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ListItem } from '../components/ListItem';
import { listStore } from '../stores/listStore';

// Мокаем listStore
jest.mock('../stores/listStore', () => ({
    listStore: {
        updateItemName: jest.fn(),
        updateItemDescription: jest.fn(),
        deleteItem: jest.fn(),
    },
}));

describe('Компонент ListItem', () => {
    const item = { id: '1', name: 'Тестовая задача', description: 'Тестовое описание' };

    test('начинает редактирование при клике на кнопку "Редактировать"', async () => {
        let editingId: string | null = null;
        const setEditingId = (id: string | null) => {
            editingId = id;
        };

        const { rerender } = render(
            <ListItem item={item} editingId={editingId} setEditingId={setEditingId} />
        );

        fireEvent.click(screen.getByText('Редактировать'));

        // Обновляем `editingId` после клика
        editingId = item.id;
        rerender(<ListItem item={item} editingId={editingId} setEditingId={setEditingId} />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Тестовая задача')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Тестовое описание')).toBeInTheDocument();
        });
    });

    test('сохраняет изменения при нажатии Enter', async () => {
        const mockSetEditingId = jest.fn();
        render(<ListItem item={item} editingId={item.id} setEditingId={mockSetEditingId} />);

        fireEvent.change(screen.getByDisplayValue('Тестовая задача'), { target: { value: 'Обновленное имя' } });
        fireEvent.change(screen.getByDisplayValue('Тестовое описание'), { target: { value: 'Обновленное описание' } });

        fireEvent.keyDown(screen.getByDisplayValue('Обновленное имя'), { key: 'Enter' });

        // Проверяем, что функции обновления были вызваны с новыми значениями
        await waitFor(() => expect(listStore.updateItemName).toHaveBeenCalledWith(item.id, 'Обновленное имя'));
        await waitFor(() => expect(listStore.updateItemDescription).toHaveBeenCalledWith(item.id, 'Обновленное описание'));
        await waitFor(() => expect(mockSetEditingId).toHaveBeenCalledWith(null));
    });

    test('отменяет изменения при нажатии Escape', async () => {
        const mockSetEditingId = jest.fn();
        render(<ListItem item={item} editingId={item.id} setEditingId={mockSetEditingId} />);

        fireEvent.change(screen.getByDisplayValue('Тестовая задача'), { target: { value: 'Обновленное имя' } });
        fireEvent.keyDown(screen.getByDisplayValue('Обновленное имя'), { key: 'Escape' });

        // Проверяем, что значения вернулись к исходным
        await waitFor(() => expect(screen.getByDisplayValue('Тестовая задача')).toHaveValue(item.name));
        await waitFor(() => expect(screen.getByDisplayValue('Тестовое описание')).toHaveValue(item.description));
        await waitFor(() => expect(mockSetEditingId).toHaveBeenCalledWith(null));
    });
});
