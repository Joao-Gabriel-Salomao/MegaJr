const Filter = ({ filter, setTipoListagem }) => {
  return (
    <div className="filter">
      <select
        value={filter}
        onChange={(e) => setTipoListagem(e.target.value)}
        className="filter-select"
      >
        <option value="concluida">Concluída</option>
        <option value="data_hora">Data/Hora</option>
        <option value="prioridade">Prioridade</option>
      </select>
    </div>
  );
};

export default Filter;
