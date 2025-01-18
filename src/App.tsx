import React from 'react';
import { List } from './components/List.tsx';
import './styles/App.css';

export const App: React.FC = () => (
    <div className="app">
        <h1>Список репозиториев на GitHub</h1>
        <List />
    </div>
);
