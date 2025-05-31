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

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const [tipoListagem, setTipoListagem] = useState("data_hora");

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
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
          const todosComEstado = data.tarefa.map((t) => ({
            ...t,
            isCompleted: !!t.concluida, // converte para boolean (p.ex.: 0/1 → true/false)
          }));
          setTodos(todosComEstado);
        })
        .catch((error) => {
          console.error("Erro:", error);
        });
    }
  }, [token, userId, tipoListagem, isAuthenticated]);

  const addTodo = (titulo, desc, data, prioridade) => {
    fetch("http://127.0.0.1:3000/tarefas", {
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
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setTodos((prevTodos) => [...prevTodos, data.tarefa]);
      })
      .catch((error) => {
        console.error("Erro:", error);
      });
  };

  const removeTodo = (id) => {
    fetch(`http://127.0.0.1:3000/tarefas/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        usuario_id: userId,
        id: id,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Removido com sucesso:", data);
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      })
      .catch((error) => {
        console.error("Erro:", error);
      });
  };

  const completeTodo = (id) => {
    fetch(`http://127.0.0.1:3000/tarefas/concluir`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        id: id,
        usuario_id: userId,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Tarefa concluída com sucesso:", data);
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
          )
        );
      })
      .catch((error) => {
        console.error("Erro ao concluir tarefa:", error);
      });
  };

  const editTodo = (id, updatedTodo) => {
    fetch(`http://127.0.0.1:3000/tarefas/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        usuario_id: userId,
        id: id,
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

  const completedTodosCount = todos.filter((todo) => todo.isCompleted).length;

  const removeAllCompleted = () => {
    const completedCount = todos.filter((todo) => todo.isCompleted).length;
    if (completedCount > 0) {
      if (
        window.confirm(
          `Deseja realmente remover ${completedCount} tarefa(s) concluída(s)?`
        )
      ) {
        fetch(`http://127.0.0.1:3000/tarefas/all`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            usuario_id: userId,
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Erro ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            console.log("Removidas com sucesso:", data);
            setTodos((prevTodos) =>
              prevTodos.filter((todo) => !todo.isCompleted)
            );
          })
          .catch((error) => {
            console.error("Erro:", error);
          });

        setTodos((prevTodos) => prevTodos.filter((todo) => !todo.isCompleted));
      }
    }
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
      <RegisterPage
        onRegister={handleLogin}
        onSwitchToLogin={() => setShowRegister(false)}
      />
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
      <Filter filter={tipoListagem} setTipoListagem={setTipoListagem} />

      {completedTodosCount > 0 && (
        <div className="bulk-actions">
          <button onClick={removeAllCompleted} className="remove-completed-btn">
            🗑️ Remover {completedTodosCount} tarefa(s) concluída(s)
          </button>
        </div>
      )}

      <div className="todo-list">
        {todos
          .filter(
            (todo) =>
              todo.titulo &&
              todo.titulo.toLowerCase().includes(search.toLowerCase())
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
