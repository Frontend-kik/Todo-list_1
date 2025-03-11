import { useEffect, useState } from 'react';
import styles from './app.module.css';

export const App = () => {
	const [task, setTask] = useState([]); //  список задач в состоянии
	const [loading, setLoading] = useState(false); //  состояние загрузки данных

	const [newTask, setNewTask] = useState(''); // Новая задача

	// Загружаем данные с сервера
	useEffect(() => {
		setLoading(true);
		fetch('http://localhost:3000/tasks')
			.then((response) => response.json())
			.then((data) => setTask(data))
			.catch((error) => console.log('Ошибка загрузки данных:', error))
			.finally(() => setLoading(false)); // После загрузки данных устанавливаем состояние загрузки в false
	}, []);

	// Добавление задачи
	const addTask = () => {
		if (!newTask.trim() === '') return; // Проверка на пустую строку

		const taskObj = { id: Date.now(), title: newTask, completed: false };

		fetch('http://localhost:3000/tasks', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json: charset=utf-8' },
			body: JSON.stringify({ taskObj }),
		})
			.then(() => setTask([...task, taskObj])) // Обновляем список
			.then((error) => console.log('Ошибка загрузки:', error))
			.finally(() => setLoading(false));

		setNewTask(''); // Очищаем поле ввода
	};

	//	Изменение статуса задачи(выполнена/не выполнена)
	const toggleTask = (id) => {
		const updateTasks = task.map((task) =>
			task.id === id ? { ...task, completed: !task.completed } : task,
		);
		setTask(updateTasks); // Обновляем состояние

		const updateTask = task.find((task) => task.id === id); // Находим задачу по id
		fetch(`http://localhost:3000/tasks/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json: charset=utf-8' },
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
				{loading ? <p>Загрузка...</p> : null}

				{/* Список задач */}
				<ul className={styles.item}>
					{task.map((task) => (
						<li key={task.id}>
							<span>{task.title}</span>
							<input
								type="checkbox"
								checked={task.completed}
								onChange={() => toggleTask(task.id)}
							/>
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
