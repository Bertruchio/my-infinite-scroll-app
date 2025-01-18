# My Infinite Scroll App

Это приложение демонстрирует реализацию списка с **бесконечным скроллом** и **постепенной подгрузкой элементов** с использованием **React**, **TypeScript**, **MobX**, **Jest** и **React Testing Library**.

## Описание

Приложение получает список репозиториев с публичного API GitHub и отображает в виде списка.

### Реализованные функции:
- **Бесконечный скролл**: элементы загружаются по мере прокрутки страницы.
- **Пагинация**: плавная подгрузка элементов с API.
- **Редактирование и удаление**: элементы можно редактировать и удалять локально.
- **Сортировка**: поддерживается сортировка списка по выбранному полю (например, по звездами репозиториев GitHub).
- **Индикация загрузки**: отображение индикатора загрузки при запросах к API.

### Особенности:
- Используется **GitHub API** для получения данных о репозиториях.
- Все взаимодействия с данными, включая редактирование, удаление и пагинацию, обрабатываются на клиентской стороне.
- Приложение использует **MobX** для управления состоянием и хранения списка элементов.

## Технологии

- **Frontend:**
  - **React** — для построения интерфейса.
  - **TypeScript** — для строгой типизации.
  - **MobX** — для управления состоянием приложения.
  - **CSS Modules** — для стилизации компонентов.
  - **Jest + React Testing Library** — для юнит-тестирования.
  - **Axios** — для выполнения HTTP-запросов к API.
  - **Vite** — для сборки и запуска проекта.

- **API:**
  - **GitHub API** — используется для получения списка репозиториев, который можно фильтровать, сортировать и отображать в интерфейсе.
