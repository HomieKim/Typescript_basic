import React from 'react';
interface todos{
  items: {id:number, text:string}[];
  deleteTodo: (id:number) => void;
}
const TodoList: React.FC<todos> = ({items, deleteTodo}) => {
  const onClickHandler = (id: number) => {
    deleteTodo(id);
  };
  return (
    <ul>
      {
        items.map(todo =>(
          <li key={todo.id}>
            <span>{todo.text}</span>
            <button onClick={() => onClickHandler(todo.id)}>delete</button>
          </li>
        ))
      }
    </ul>
  )
};

export default TodoList;