import React, { useRef } from 'react';

interface Props{
  addTodo: (text : string) => void;
}

const NewTodo : React.FC<Props> = ({addTodo}) =>{
  const textInputRef = useRef<HTMLInputElement>(null);
  const submitHandler = (e : React.FormEvent) =>{
    e.preventDefault();
    const enterText= textInputRef.current!.value;
    addTodo(enterText);
    textInputRef.current!.value = '';
  }
  return (
    <form onSubmit={submitHandler}>
      <div>
        <label htmlFor='todo-text'>Todo Text</label>
        <input type='text' id='todo-text' ref={textInputRef}/>
      </div>
      <button type='submit'>ADD TODO</button>
    </form>
  )
}

export default NewTodo;