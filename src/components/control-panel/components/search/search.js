import { useRef, useState } from "react";
import { debounce } from "./utils";
import styles from "./search.module.css";

export const Search = ({ onSearch }) => {
  const [value, setValue] = useState("");

  const debounceOnSearch = useRef(debounce(onSearch, 1500)).current;

  const onChange = ({ target }) => {
    setValue(target.vaue);
    debounceOnSearch(target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    onSearch(value);
  };

  return (
    <form className={styles.search} onSubmit={onSubmit}>
      <input
        className={styles.input}
        type="text"
        value={value}
        placeholder="Поиск..."
        onChange={onChange}
      />
    </form>
  );
};
