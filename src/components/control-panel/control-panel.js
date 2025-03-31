import { Button } from "../button/button";
import { Search, Sorting } from "./components/";
import styles from "./control-panel.module.css";

export const ControlPanel = ({ onTodoAdd, onSearch, onSorting }) => {
  return (
    <div className={styles.controlPanel}>
      <Search onSearch={onSearch}></Search>
      <Sorting onSorting={onSorting}></Sorting>
      <Button onClick={onTodoAdd}>✚</Button>
    </div>
  );
};
