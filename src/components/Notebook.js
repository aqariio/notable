import "./Notebook.css";

function Notebook() {
  return (
    <div className="notebook">
      <header className="header">
        <p>Notebook</p>
      </header>
      <textarea id="doc" className="doc" type="text" onInput={resize}/>
    </div>
  );
}

function resize(e) {
  e.target.style.height = 'inherit';
  e.target.style.height = `calc(${e.target.scrollHeight}px)`;
}

export default Notebook;
