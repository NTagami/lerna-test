type Bland<T, U extends string> = T & { [key in U]: never };

type TodoId = Bland<string, "Todo">;
export const toTodoId = (s: string) => s as TodoId;

export interface Todo {
  id: TodoId;
  title: string;
}
