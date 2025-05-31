import { useState } from "react";
import { useEffect } from "react";

import "./App.css";
import Todo from "./components/Todo";
import TodoForm from "./components/TodoForm";
import Search from "./components/Search";
import Filter from "./components/Filter";

import LoginPage from "./components/LoginPage"; // Importar o componente de login
import RegisterPage from "./components/RegisterPage";



function App() {
  const [todos, setTodos] = useState([]);

  const [search, setSearch] = useState("");

  const [showRegister, setShowRegister] = useState(false);

  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Asc");

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const [tipoListagem, setTipoListagem] = useState("concluida");

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    fetch(
      `http://127.0.0.1:3000/tarefas?usuario_id=${userId}&tipoListagem=${tipoListagem}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.tarefa);
        setTodos(data.tarefa);
      })
      .catch((error) => {
        console.error("Erro:", error);
      });
  }, [token, userId, tipoListagem]);

  const addTodo = (titulo, desc, data, prioridade) => {
    fetch("127.0.0.1:3000/tarefas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        usuario_id: userId,
        titulo: titulo,
        descricao: desc,
        data_hora: data,
        prioridade: prioridade,
        timezone: "America/Cuiaba",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTodos(data);
      })
      .catch((error) => {
        console.error("Erro:", error);
      });
  };

  const removeTodo = (id) => {
    const newTodos = [...todos];
    const filteredTodos = newTodos.filter((todo) =>
      todo.id !== id ? todo : null
    );
    setTodos(filteredTodos);
  };

  const completeTodo = (id) => {
    const newTodos = [...todos];
    newTodos.map((todo) =>
      todo.id === id ? (todo.isCompleted = !todo.isCompleted) : todo
    );
    setTodos(newTodos);
  };

  // ✅ Função para editar uma tarefa
const editTodo = (id, updatedTodo) => {
  fetch(`http://127.0.0.1:3000/tarefas/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({
      titulo: updatedTodo.titulo,
      descricao: updatedTodo.descricao,
      data_hora: updatedTodo.data_hora,
      prioridade: updatedTodo.prioridade,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erro ${response.status}`);
      }
      return response.json();
    })
    .then(() => {
      const newTodos = todos.map((todo) =>
        todo.id === id ? { ...todo, ...updatedTodo } : todo
      );
      setTodos(newTodos);
    })
    .catch((error) => {
      console.error("Erro ao editar:", error);
      alert("Erro ao editar a tarefa!");
    });
};

  // Função para fazer login
  const handleLogin = (userData) => {
    setCurrentUser(userData.username);
    setIsAuthenticated(true);
  };

  // Função para fazer logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser("");
    setTodos([]); // Limpar todos ao fazer logout
  };

  // Se não estiver autenticado, mostrar página de login
  if (!isAuthenticated) {
    return showRegister ? (
    <RegisterPage onSwitchToLogin={() => setShowRegister(false)} />
  ) : (
    <LoginPage 
      onLogin={handleLogin} 
      onSwitchToRegister={() => setShowRegister(true)} 
    />
  );
  }

  // Se estiver autenticado, mostrar a aplicação principal
  return (
    <div className="app">
      {/* Header com informações do usuário e logout */}
      <div className="app-header">
        <h1>Lista de Tarefas</h1>
        <div className="user-info">
          <span>Bem-vindo, {currentUser}!</span>
          <button onClick={handleLogout} className="logout-btn">
            Sair
          </button>
        </div>
      </div>

      <Search search={search} setSearch={setSearch} />
      <Filter filter={filter} setFilter={setFilter} setSort={setSort} />

      <div className="todo-list">
        {todos
          .filter((todo) => {
            if (filter === "All") return true;
            if (filter === "Completed") return todo.isCompleted === true;
            if (filter === "Incomplete") return todo.isCompleted === false;
            return true;
          })
          .filter(
            (todo) =>
              todo.titulo &&
              todo.titulo.toLowerCase().includes(search.toLowerCase())
          )
          .sort((a, b) =>
            sort === "Asc"
              ? a.titulo.localeCompare(b.titulo)
              : b.titulo.localeCompare(a.titulo)
          )
          .map((todo) => (
            <Todo
              key={todo.id}
              todo={todo}
              removeTodo={removeTodo}
              completeTodo={completeTodo}
              editTodo={editTodo}
            />
          ))}
      </div>

      <TodoForm addTodo={addTodo} />
    </div>
  );
}

export default App;
