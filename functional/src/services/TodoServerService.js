const DATA_TODO_LIST_RESOURCE = 'todos';

function processResponse(response, methodName) {
  console.log(`> ServerService -> ${methodName}: response.data =`, response);
  if (response.ok === false) throw new Error(`ServerService - ${methodName}: error(${response.statusText})`);
  return response.json();
}

class TodoServerService {
  constructor(url) {
    console.log('> ServerService -> constructor', url);
    this.url = url;
  }

  get path() {
    return `${this.url}/${DATA_TODO_LIST_RESOURCE}`;
  }

  async requestTodos() {
    console.log(`> ServerService -> requestTodos: path =`, this.path);
    try {
      return await fetch(this.path, {
        method: 'GET',
      }).then((response) => processResponse(response, 'requestTodos'));
    } catch (error) {
      console.log(`> ServerService -> requestTodos: error = ${error}`);
      throw error;
    }
  }

  async saveTodo(todoVO) {
    console.log(`> ServerService -> saveTodo: todoVO`, todoVO);
    return fetch(this.path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todoVO),
    })
      .then((response) => processResponse(response, 'saveTodo'))
      .catch((error) => {
        console.log(`> ServerService -> saveTodo: error = ${error}`);
        throw error;
      });
  }

  async deleteTodo(id) {
    return fetch(`${this.path}/${id}`, {
      method: 'DELETE',
    })
      .then((response) => processResponse(response, 'deleteTodo'))
      .catch((error) => {
        console.log(`> ServerService -> deleteTodo: error = ${error}`);
        throw error;
      });
  }

  async updateTodo(todoVO) {
    return fetch(`${this.path}/${todoVO.id}`, {
      method: 'PUT',
      body: JSON.stringify(todoVO),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => processResponse(response, 'updateTodo'))
      .catch((error) => {
        console.log(`> ServerService -> updateTodo: error = ${error}`);
        throw error;
      });
  }
}

export default TodoServerService;
