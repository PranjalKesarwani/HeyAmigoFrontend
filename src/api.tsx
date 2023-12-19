import { Todo } from "./types";

const todos:Todo[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com',title:'Johnny' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' ,title:'Jane'},
    { id: 3, name: 'Alice Johnson', email: 'alice@example.com',title:'Alice' },
    { id: 4, name: 'Mark Johnson', email: 'mark@example.com',title:'Mark' },
    { id: 5, name: 'Emily Brown', email: 'emily@example.com',title:'Emily' },
    { id: 6, name: 'Michael Williams', email: 'michael@example.com' ,title:'Michael'},
    { id: 7, name: 'Sophia Garcia', email: 'sophia@example.com',title:'Sophia' },
    { id: 8, name: 'William Rodriguez', email: 'william@example.com' ,title:'William'}
  ];

  export const fetchTodos = async (query = ""): Promise<Todo[]> =>{

 await new Promise((resolve):any=>setTimeout(resolve,1000));
   


    const filteredTodos = todos.filter((todo)=>{
       return todo.title.toLowerCase().includes(query.toLowerCase())
    });


    return [...filteredTodos];
  };



  export const addTodo = async (todo: Pick<Todo,"title">):Promise<Todo> =>{
    console.log(todo)
    await new Promise((resolve)=> setTimeout(resolve,500));

    const newTodo = {
        id: todos.length + 1,
        name:'Pranjal Kesarwani',
        email:'pranjalkesarwani@gmail.com',
        title:todo.title
    }
    todos.push(newTodo);

    return newTodo;
  }