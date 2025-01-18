import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { listStore } from '../stores/listStore';
import styles from '../styles/ListItem.module.css';

type ListItemProps = {
    item: {
        id: string;
        name: string;
        description: string;
    };
    editingId: string | null;
    setEditingId: (id: string | null) => void;
};

export const ListItem: React.FC<ListItemProps> = observer(({ item, editingId, setEditingId }) => {
    const isEditing = editingId === item.id;
    const [editedName, setEditedName] = useState(item.name);
    const [editedDescription, setEditedDescription] = useState(item.description);

    useEffect(() => {
        setEditedName(item.name);
        setEditedDescription(item.description);
    }, [item]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setEditedName(e.target.value);
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => setEditedDescription(e.target.value);

    const saveChanges = async () => {
        try {
            await listStore.updateItemName(item.id, editedName);
            await listStore.updateItemDescription(item.id, editedDescription);
            setEditingId(null);
        } catch (error) {
            console.error('Error saving changes:', error);
        }
    };

    const cancelChanges = () => {
        setEditedName(item.name);
        setEditedDescription(item.description);
        setEditingId(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            saveChanges();
        } else if (e.key === 'Escape') {
            cancelChanges();
        }
    };

    const handleEditClick = () => setEditingId(item.id);

    return (
        <div className={styles.item}>
            {isEditing ? (
                <>
                    <span>
                        <input
                            value={editedName}
                            onChange={handleNameChange}
                            onKeyDown={handleKeyDown}
                            autoFocus
                        />
                    </span>
                    <span>
                        <input
                            value={editedDescription}
                            onChange={handleDescriptionChange}
                            onKeyDown={handleKeyDown}
                        />
                    </span>
                    <button onClick={saveChanges}>Сохранить</button>
                    <button onClick={cancelChanges}>Отменить</button>
                </>
            ) : (
                <>
                    <span>{item.name}</span>
                    <span>{item.description}</span>
                    <button onClick={handleEditClick}>Редактировать</button>
                    <button onClick={() => listStore.deleteItem(item.id)}>Удалить</button>
                </>
            )}
        </div>
    );
});
