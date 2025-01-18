import { makeObservable, observable, action, runInAction } from 'mobx';
import axios from 'axios';

class ListStore {
    items: { id: string; name: string; description: string }[] = [];
    loading = false;
    page = 1;
    error: string | null = null;

    constructor() {
        makeObservable(this, {
            items: observable,
            loading: observable,
            page: observable,
            error: observable,
            fetchItems: action,
            editItem: action,
            deleteItem: action,
        });
    }

    async fetchItems(sortField: string = 'stars', sortOrder: 'asc' | 'desc' = 'asc') {
        this.loading = true;
        this.error = null;
        try {
            const response = await axios.get(
                `https://api.github.com/search/repositories?q=javascript&sort=${sortField}&order=${sortOrder}&page=${this.page}`
            );

            if (!response.data || !Array.isArray(response.data.items)) {
                throw new Error('Неверные данные в ответе');
            }

            runInAction(() => {
                const newItems = response.data.items.filter(
                    (item: { id: string }) => !this.items.some(existingItem => existingItem.id === item.id)
                );
                this.items = [...this.items, ...newItems];
                this.page += 1;
                this.loading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.loading = false;
                this.error = 'Не удалось загрузить данные. Пожалуйста, попробуйте снова позже.'; // Устанавливаем сообщение об ошибке
            });
            console.error('Ошибка при загрузке элементов:', error);
        }
    }

    editItem(id: string, updatedFields: Partial<{ name: string; description: string }>) {
        const itemIndex = this.items.findIndex((item) => item.id === id);
        if (itemIndex > -1) {
            runInAction(() => {
                this.items[itemIndex] = { ...this.items[itemIndex], ...updatedFields };
            });
        }
    }

    deleteItem(id: string) {
        runInAction(() => {
            this.items = this.items.filter((item) => item.id !== id);
        });
    }

    updateItemName(id: string, name: string) {
        const item = this.items.find((item) => item.id === id);
        if (item) {
            item.name = name;
        }
    }

    updateItemDescription(id: string, description: string) {
        const item = this.items.find((item) => item.id === id);
        if (item) {
            item.description = description;
        }
    }
}

export const listStore = new ListStore();
