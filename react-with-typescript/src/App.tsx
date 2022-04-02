import React, { useState } from 'react';
import NewTodo from './components/NewTodo';
import TodoList from './components/TodoList';

interface Todo{
  id: number
  text: string;
}

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodoHandler = (text : string) =>{
    const newTodoList = [...todos, {
      id: Date.now(),
      text: text,
    }]
    setTodos(newTodoList);
  }

  const deleteHandler = (id: number) => {
    const deletedList = todos.filter((todo) => todo.id !== id);
    setTodos(deletedList);
  }

  return (
    <div>
      <NewTodo addTodo={addTodoHandler}/>
      <TodoList items={todos} deleteTodo={deleteHandler}/>
    </div>
  )
};

export default App;