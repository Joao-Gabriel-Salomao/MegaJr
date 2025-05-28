import { useState } from "react";
import { useEffect } from "react";

import "./App.css";
import Todo from "./components/Todo";
import TodoForm from "./components/TodoForm";
import Search from "./components/Search";
import Filter from "./components/Filter";

function App() {
  const [todos, setTodos] = useState([]);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Asc");

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(
    (listagem) => {
      fetch("127.0.0.1:3000/tarefas", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          usuario_id: userId,
          listagem: listagem,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setTodos(data.tarefa);
        })
        .catch((error) => {
          console.error("Erro:", error);
        });
    },
    [token, userId]
  );

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

  return (
    <div className="app">
      <h1>Lista de Tarefas</h1>
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
          .filter((todo) =>
            todo.text.toLowerCase().includes(search.toLowerCase())
          )
          .sort((a, b) =>
            sort === "Asc"
              ? a.text.localeCompare(b.text)
              : b.text.localeCompare(a.text)
          )
          .map((todo) => (
            <Todo
              key={todo.id}
              todo={todo}
              removeTodo={removeTodo}
              completeTodo={completeTodo}
            />
          ))}
      </div>
      <TodoForm addTodo={addTodo} />
    </div>
  );
}

export default App;
