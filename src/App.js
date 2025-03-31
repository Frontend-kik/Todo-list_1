import { useEffect, useState } from "react";
import { Todo, ControlPanel } from "./components";
import { createTodo, readTodos, updateTodo, deleteTodo } from "./api/api";
import {
  addTodoInTodos,
  findTodo,
  removeTodoInTodos,
  setTodoInTodos,
} from "./utils";
import styles from "./app..module.css";
import { NEW_TODO_ID } from "./constants";

export const App = () => {
  const [todos, setTodos] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [isAlphabetSorting, setIsAlphabetSorting] = useState(false);

  const onTodoAdd = () => {
    setTodos(addTodoInTodos(todos));
  };

  const onTodoSave = (todoId) => {
    const { title, completed } = findTodo(todos, todoId) || {};

    if (todoId === NEW_TODO_ID) {
      createTodo({ title, completed }).then(({ todo }) => {
        let updatedTodos = setTodoInTodos(todos, {
          id: NEW_TODO_ID,
          isEditing: false,
        });

        updatedTodos = removeTodoInTodos(updatedTodos, NEW_TODO_ID);
        updatedTodos = addTodoInTodos(updatedTodos, todo);
        setTodos(updatedTodos);
      });
    } else {
      updateTodo({ id: todoId, title }).then(() => {
        setTodos(
          setTodoInTodos(todos, { id: todoId, title, isEditing: false }),
        );
      });
    }
  };

  const onTodoEdit = (id) => {
    setTodos(setTodoInTodos(todos, { id, isEditing: true }));
  };

  const onTodoTitleChange = (id, newTitle) => {
    setTodos(setTodoInTodos(todos, { id, title: newTitle }));
  };

  const onTodoCompletedChange = (id, newCompleted) => {
    updateTodo({ id, completed: newCompleted }).then(() => {
      setTodos(setTodoInTodos(todos, { id, completed: newCompleted }));
    });
  };

  const onTodoRemove = (id) => {
    deleteTodo(id).then(() => setTodos(removeTodoInTodos(todos, id)));
  };

  useEffect(() => {
    readTodos(searchPhrase, isAlphabetSorting).then((loadedTodos) =>
      setTodos(loadedTodos),
    );
  }, [searchPhrase, isAlphabetSorting]);

  return (
    <div className={styles.app}>
      <ControlPanel
        onTodoAdd={onTodoAdd}
        onSearch={setSearchPhrase}
        onSorting={setIsAlphabetSorting}
      />
      <div>
        {todos.map(({ id, title, completed, isEditing = false }) => (
          <Todo
            key={id}
            id={id}
            title={title}
            completed={completed}
            isEditing={isEditing}
            onEdit={() => onTodoEdit(id)}
            onTitleChange={(newTitle) => onTodoTitleChange(id, newTitle)}
            onCompletedChange={(newCompleted) =>
              onTodoCompletedChange(id, newCompleted)
            }
            onSave={() => onTodoSave(id)}
            onRemove={() => onTodoRemove(id)}
          />
        ))}
      </div>
    </div>
  );
};
