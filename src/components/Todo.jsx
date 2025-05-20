import React from 'react'

const Todo = ({ todo, removeTodo, completeTodo }) => {
  return (
    <div>
        <div className="todo" style={{textDecoration: todo.isCompleted ? "line-through" : ""}}>
          <div className="content">
            <p>{todo.text}</p>
            <div className="category">({todo.category})</div>
          </div>
          <div>
            <button className='complete' onClick={() => completeTodo(todo.id)}>Completar</button>
            <button className='remove' onClick={() => removeTodo(todo.id)}>x</button>
          </div>
        </div>
    </div>
  )
}

console.log("Renderizando:", Todo)
export default Todo
