import { Todo } from "../types"

const TodoCard = ({todo}:{todo:Todo}) => {
  return (
    <div className="mx-5 my-1 w-[30rem]">
     <h1 className="text-3xl">title: {todo.title}</h1>
    </div>
  )
}

export default TodoCard
