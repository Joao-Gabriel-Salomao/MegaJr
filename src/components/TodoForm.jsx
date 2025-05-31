import { useState } from "react";

const TodoForm = ({ addTodo }) => {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataHora, setDataHora] = useState("");
  const [prioridade, setPrioridade] = useState("media");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validação básica
    if (!titulo.trim() || !descricao.trim() || !dataHora) {
      alert("Por favor, preencha todos os campos!");
      return;
    }
    
    // Chama a função addTodo do App.jsx
    addTodo(titulo, descricao, dataHora, prioridade);
    
    // Limpa o formulário
    setTitulo("");
    setDescricao("");
    setDataHora("");
    setPrioridade("media");
  };

  // Função para obter a data/hora atual no formato correto
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="todo-form">
      <h2>Criar Nova Tarefa</h2>
      <form onSubmit={handleSubmit}>
        {/* Campo Título */}
        <div className="form-group">
          <label htmlFor="titulo">Título da Tarefa *</label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            placeholder="Digite o título da tarefa..."
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>

        {/* Campo Descrição */}
        <div className="form-group">
          <label htmlFor="descricao">Descrição *</label>
          <textarea
            id="descricao"
            value={descricao}
            placeholder="Descreva os detalhes da tarefa..."
            onChange={(e) => setDescricao(e.target.value)}
            rows={3}
            required
          />
        </div>

        {/* Campo Data e Hora */}
        <div className="form-group">
          <label htmlFor="dataHora">Data e Hora *</label>
          <input
            type="datetime-local"
            id="dataHora"
            value={dataHora}
            min={getMinDateTime()}
            onChange={(e) => setDataHora(e.target.value)}
            required
          />
        </div>

        {/* Campo Prioridade */}
        <div className="form-group">
          <label htmlFor="prioridade">Prioridade</label>
          <select
            id="prioridade"
            value={prioridade}
            onChange={(e) => setPrioridade(e.target.value)}
          >
            <option value="alta">🔴 Alta Prioridade</option>
            <option value="media">🟡 Média Prioridade</option>
            <option value="baixa">🟢 Baixa Prioridade</option>
          </select>
        </div>

        <button type="submit" className="btn-submit">
          ➕ Criar Tarefa
        </button>
      </form>
    </div>
  );
};

export default TodoForm;