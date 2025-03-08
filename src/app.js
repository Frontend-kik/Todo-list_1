import { useEffect, useState } from 'react';
import styles from './app.module.css';

export const App = () => {
	const [task, setTask] = useState([]); // Держим список задач в состоянии

	useEffect(() => {
		fetch('https://jsonplaceholder.typicode.com/todos?_limit=5')
			.then((response) => response.json())
			.then((data) => setTask(data))
			.catch((error) => console.log('Ошибка загрузки данных с сервера:', error));
	}, []);

	return (
		<div className={styles.container}>
			<div className={styles.card}>
				<h2>Спискок задач:</h2>
				{/* <button>Добавить задачу</button> */}
				<ul className={styles.item}>
					{task.map((task) => (
						<li key={task.title}>
							<input type="checkbox" defaultChecked={task.completed} />
							<span>{task.title}</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};
