import { client } from '../utils/http';

const USER_ID = 3465;

export const getTodos = async () => {
  const { data } = await client.get(`/todos?userId=${USER_ID}`);
  return data;
};

export const createTodo = async (title) => {
  const { data } = await client.post('/todos', {
    title,
    userId: USER_ID,
    completed: false,
  });
  return data;
};

export const updateTodo = async ({id, title, completed }) => {
  const { data } = await client.patch(`/todos/${id}`, { title, completed });
  return data;
}

export const deleteTodo = async (id) => {
  await client.delete(`/todos/${id}`);
};