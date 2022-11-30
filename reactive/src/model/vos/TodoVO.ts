class TodoVO {
  private readonly _id: string;
  private readonly _date: Date;

  public isCompleted: boolean;
  public title: string;

  get id() { return this._id; }

  static createFromTitle(title: string, id?: string) {
    const todoId = id ?? Date.now().toString();
    return new TodoVO(todoId, title);
  }

  constructor(id: string, title: string, date = new Date()) {
    this._id = id;
    this._date = date;
    this.title = title;
    this.isCompleted = false;
  }
}

export default TodoVO;
