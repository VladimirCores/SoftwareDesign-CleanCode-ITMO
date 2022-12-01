class ErrorView {
  static createTodoListRetrieveError(error) {
    return `
      <div id="errorOnInit">
        <h1>Problem with server</h1>
        <p style="color:red">${error.toString()}<p>
      </div>\`
    `;
  }
}

export default ErrorView;
