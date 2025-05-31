import { useState } from "react";

const Todo = ({ todo, removeTodo, completeTodo, editTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitulo, setEditTitulo] = useState(todo.titulo);
  const [editDescricao, setEditDescricao] = useState(todo.descricao || "");
  const [editDataHora, setEditDataHora] = useState(
    todo.data_hora ? todo.data_hora.slice(0, 16) : ""
  );
  const [editPrioridade, setEditPrioridade] = useState(
    todo.prioridade || "media"
  );

  // Função para obter a cor da prioridade
  const getPriorityColor = (prioridade) => {
    switch (prioridade) {
      case "alta":
        return "#EF4444"; // Vermelho
      case "media":
        return "#F59E0B"; // Amarelo
      case "baixa":
        return "#10B981"; // Verde
      default:
        return "#8B5CF6"; // Cinza padrão
    }
  };

  // Função para obter o texto da prioridade
  const getPriorityText = (prioridade) => {
    switch (prioridade) {
      case "alta":
        return "Alta";
      case "media":
        return "Média";
      case "baixa":
        return "Baixa";
      default:
        return "Média";
    }
  };

  // Função para formatar data
  const formatDate = (dateString) => {
    if (!dateString) return "Sem data definida";
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR");
  };

  // Função para salvar edição
  const handleSaveEdit = () => {
    if (!editTitulo.trim() || !editDescricao.trim()) {
      alert("Título e descrição são obrigatórios!");
      return;
    }

    editTodo(todo.id, {
      titulo: editTitulo,
      descricao: editDescricao,
      data_hora: editDataHora,
      prioridade: editPrioridade,
    });

    setIsEditing(false);
  };

  // Função para cancelar edição
  const handleCancelEdit = () => {
    setEditTitulo(todo.titulo);
    setEditDescricao(todo.descricao || "");
    setEditDataHora(todo.data_hora ? todo.data_hora.slice(0, 16) : "");
    setEditPrioridade(todo.prioridade || "media");
    setIsEditing(false);
  };

  return (
    <div
      className={`todo ${todo.isCompleted ? "completed" : ""}`}
      style={{
        borderLeft: `5px solid ${getPriorityColor(todo.prioridade)}`,
        marginBottom: "15px",
        padding: "15px",
        backgroundColor: todo.isCompleted ? "#e9ecef" : "#f8f9fa",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      {isEditing ? (
        // Modo de Edição
        <div className="todo-edit-form">
          <div className="form-group">
            <label>Título:</label>
            <input
              type="text"
              value={editTitulo}
              onChange={(e) => setEditTitulo(e.target.value)}
              className="edit-input"
            />
          </div>

          <div className="form-group">
            <label>Descrição:</label>
            <textarea
              value={editDescricao}
              onChange={(e) => setEditDescricao(e.target.value)}
              rows={2}
              className="edit-textarea"
            />
          </div>

          <div className="form-group">
            <label>Data e Hora:</label>
            <input
              type="datetime-local"
              value={editDataHora}
              onChange={(e) => setEditDataHora(e.target.value)}
              className="edit-input"
            />
          </div>

          <div className="form-group">
            <label>Prioridade:</label>
            <select
              value={editPrioridade}
              onChange={(e) => setEditPrioridade(e.target.value)}
              className="edit-select"
            >
              <option value="alta">🔴 Alta Prioridade</option>
              <option value="media">🟡 Média Prioridade</option>
              <option value="baixa">🟢 Baixa Prioridade</option>
            </select>
          </div>

          <div className="edit-buttons">
            <button onClick={handleSaveEdit} className="btn-save">
              ✅ Salvar
            </button>
            <button onClick={handleCancelEdit} className="btn-cancel">
              ❌ Cancelar
            </button>
          </div>
        </div>
      ) : (
        // Modo de Visualização
        <div className="todo-content">
          <div className="todo-header">
            <h3 className={todo.isCompleted ? "completed-text" : ""}>
              {todo.titulo}
            </h3>
            <div
              className="priority-badge"
              style={{
                background: getPriorityColor(todo.prioridade),
                borderRadius: "0.45rem",
              }}
            >
              {getPriorityText(todo.prioridade)}
            </div>
          </div>

          <p
            className={`todo-description ${
              todo.isCompleted ? "completed-text" : ""
            }`}
          >
            {todo.descricao || "Sem descrição"}
          </p>

          <div className="todo-date">📅 {formatDate(todo.data_hora)}</div>

          <div className="todo-actions">
            <button
              className="complete-btn"
              onClick={() => completeTodo(todo.id)}
            >
              {todo.isCompleted ? "↩️ Reabrir" : "✅ Concluir"}
            </button>

            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              ✏️ Editar
            </button>

            <button
              className="remove-btn"
              onClick={() => {
                if (
                  window.confirm("Tem certeza que deseja excluir esta tarefa?")
                ) {
                  removeTodo(todo.id);
                }
              }}
            >
              🗑️ Excluir
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Todo;
