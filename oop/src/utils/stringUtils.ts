export function utilStringTodoCount(count: number, completedCount: number, separator = ' | ') {
  return `${count.toString()}${separator}${completedCount.toString()}`;
}
