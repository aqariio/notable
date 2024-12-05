import styles from "./Notebook.module.css";

function Notebook() {
  return (
    <div className={styles.notebook}>
      <header className={styles.header}>
        <p>Notebook</p>
      </header>
      <textarea id="doc" className={styles.doc} type="text" onInput={resize}/>
    </div>
  );
}

function resize(e) {
  e.target.style.height = 'inherit';
  e.target.style.height = `calc(${e.target.scrollHeight}px)`;
}

export default Notebook;
