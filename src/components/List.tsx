import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { listStore } from '../stores/listStore';
import { ListItem } from './ListItem';
import { Loader } from './Loader';
import styles from '../styles/List.module.css';

export const List: React.FC = observer(() => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [sortField, setSortField] = useState<string>('stars');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        const fetchInitialItems = async () => {
            try {
                await listStore.fetchItems(sortField, sortOrder);
            } catch (error) {
                console.error('Ошибка при получении начальных элементов:', error);
            }
        };

        fetchInitialItems().catch((error) => {
            console.error('Необработанная ошибка в fetchInitialItems:', error);
        });

        observerRef.current = new IntersectionObserver(async (entries) => {
            if (entries[0].isIntersecting) {
                try {
                    await listStore.fetchItems(sortField, sortOrder);
                } catch (error) {
                    console.error('Ошибка при получении элементов при прокрутке:', error);
                }
            }
        });

        const target = document.getElementById('end-of-list');
        if (target) observerRef.current.observe(target);

        return () => observerRef.current?.disconnect();
    }, [sortField, sortOrder]);

    const handleSortChange = async (field: string) => {
        const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(newOrder);
        listStore.page = 1;
        listStore.items = [];
        try {
            await listStore.fetchItems(field, newOrder);
        } catch (error) {
            console.error('Ошибка при изменении сортировки:', error);
        }
    };

    return (
        <div className={styles.listContainer}>
            <div className={styles.sortControls}>
                <div className={styles.columnHeader}>
                    <button
                        className={`${styles.sortButton} ${sortField === 'name' ? styles.active : ''}`}
                        onClick={() => handleSortChange('name')}
                    >
                        Название
                        {sortField === 'name' && (
                            <span className={styles.arrow}>{sortOrder === 'asc' ? '▲' : '▼'}</span>
                        )}
                    </button>
                </div>
                <div className={styles.columnHeader}>
                    <button
                        className={`${styles.sortButton} ${sortField === 'stars' ? styles.active : ''}`}
                        onClick={() => handleSortChange('stars')}
                    >
                        Звёзды
                        {sortField === 'stars' && (
                            <span className={styles.arrow}>{sortOrder === 'asc' ? '▲' : '▼'}</span>
                        )}
                    </button>
                </div>
                <div className={styles.columnHeader}>
                    <button
                        className={`${styles.sortButton} ${sortField === 'updated' ? styles.active : ''}`}
                        onClick={() => handleSortChange('updated')}
                    >
                        Дата обновления
                        {sortField === 'updated' && (
                            <span className={styles.arrow}>{sortOrder === 'asc' ? '▲' : '▼'}</span>
                        )}
                    </button>
                </div>
            </div>

            <div className={styles.list}>
                {(listStore.items || []).map((item) => (
                    <ListItem
                        key={item.id}
                        item={item}
                        editingId={editingId}
                        setEditingId={setEditingId}
                    />
                ))}
                {listStore.loading && <Loader />}
                {listStore.error && <div className={styles.errorMessage}>{listStore.error}</div>}
                <div id="end-of-list" />
            </div>
        </div>
    );
});
