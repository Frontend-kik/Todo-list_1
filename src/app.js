import { useEffect, useState } from 'react';
import styles from './app.module.css';

export const App = () => {
	const [task, setTask] = useState([]); //  список задач в состоянии
	const [loading, setLoading] = useState(false); //  состояние загрузки данных
	const [newTask, setNewTask] = useState(''); // Новая задача
	const [search, setSearch] = useState(''); // Поиск задачи
	const [isSorted, setIsSorted] = useState(''); // сортировка задачи
	const [debouncedSearch, setDebouncedSearch] = useState(''); // Дебаунс-поиск

	// Загружаем данные с сервера при первом рендере
	useEffect(() => {
		setLoading(true);
		fetch('http://localhost:3000/tasks')
			.then((response) => response.json())
			.then((data) => setTask(data))
			.catch((error) => console.log('Ошибка загрузки данных:', error))
			.finally(() => setLoading(false)); // После загрузки данных устанавливаем состояние загрузки в false
	}, []);

	// 🎯 Дебаунс-функция для поиска (ждем 300 мс после последнего ввода)

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(search);
		}, 300);
		return () => clearTimeout(timer); // Очищаем таймер при каждом новом вводе
	}, [search]);

	// Добавление новой задачи
	const addTask = () => {
		if (newTask.trim() === '') return; // Проверка на пустую строку

		const taskObj = { id: Date.now(), title: newTask, completed: false };

		fetch('http://localhost:3000/tasks', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json; charset=utf-8' },
			body: JSON.stringify({ taskObj }),
		})
			.then(() => setTask([...task, taskObj])) // Обновляем список
			.then((error) => console.log('Ошибка загрузки:', error));
		// .finally(() => setLoading(false));

		setNewTask(''); // Очищаем поле ввода
	};

	// 🔎 Фильтрация задач по поисковой фразе
	const filteredTask = task.filter(
		(task) =>
			// (task) => task.title.toLowerCase().includes(search.toLowerCase()),
			task.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
		// Фильтрация задач по ДЕБАУНС-фразе
	);
	// Сортировка задачи по алфавиту
	const sortedTask = isSorted
		? [...filteredTask].sort((a, b) => a.title.localeCompare(b.title))
		: filteredTask;

	//	Изменение статуса задачи(выполнена/не выполнена)
	const toggleTask = (id) => {
		const updateTasks = task.map((task) =>
			task.id === id ? { ...task, completed: !task.completed } : task,
		);
		setTask(updateTasks); // Обновляем состояние

		const updateTask = updateTasks.find((task) => task.id === id); // Находим задачу по id
		fetch(`http://localhost:3000/tasks/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json; charset=utf-8' },
			body: JSON.stringify(updateTask),
		}).catch((error) => console.log('Ошибка загрузки:', error));
	};

	// Удаление задачи
	const deleteTask = (id) => {
		const updateTasks = task.filter((task) => task.id !== id);
		setTask(updateTasks); // Обновляем состояние

		fetch(`http://localhost:3000/tasks/${id}`, {
			method: 'DELETE',
		}).catch((error) => console.log('Ошибка загрузки:', error));
	};

	return (
		<div className={styles.container}>
			<div className={styles.card}>
				<h2>Спискок задач:</h2>
				<div className={styles.todo_input_container}>
					{/* Поле ввода для поиска задачи */}
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Поиск задачи..."
					/>

					{/* Поле ввода для новой задачи */}
					<input
						type="text"
						value={newTask}
						onChange={(e) => setNewTask(e.target.value)}
						placeholder="Добавить задачу..."
					/>
					<button className={styles.btn} onClick={addTask}>
						Добавить
					</button>
					{/* // Кнопка сортировки */}
					<button onClick={() => setIsSorted(!isSorted)} className={styles.btn}>
						{isSorted ? 'Отменить сортировку' : 'Сортировать A-Z'}
					</button>
				</div>
				{loading ? <p>Загрузка...</p> : null}

				{/* Список задач */}
				<ul className={styles.todo_list}>
					{sortedTask.map((task) => (
						<li key={task.id} className={styles.todo_item}>
							<input
								type="checkbox"
								checked={task.completed}
								onChange={() => toggleTask(task.id)}
							/>
							<span>{task.title}</span>
							<button
								className={styles.btn}
								onClick={deleteTask.bind(null, task.id)}
							>
								Удалить
							</button>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};
