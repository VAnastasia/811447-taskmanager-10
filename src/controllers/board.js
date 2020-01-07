const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

import SortComponent, {SortType} from "../components/sort";
import NoTasksComponent from "../components/no-tasks";
import TasksComponent from "../components/tasks";
import LoadMoreComponent from "../components/load-more";
import {render, RenderPosition} from "../utils";
import TaskController from "./task";

const renderTasks = (taskListElement, tasks, onDataChange, onViewChange) => {
  return tasks.map((task) => {
    const taskController = new TaskController(taskListElement, onDataChange, onViewChange);
    taskController.render(task);

    return taskController;
  });
};

export default class BoardController {
  constructor(container, tasksModel) {
    this._container = container;
    this._tasksModel = tasksModel;

    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreComponent = new LoadMoreComponent();

    this._showedTaskControllers = [];
    this._showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._tasksModel.setFilterChangeHandler(this._onFilterChange);
  }

  _onDataChange(taskController, oldData, newData) {
    const isSuccess = this._tasksModel.updateTask(oldData.id, newData);

    if (isSuccess) {
      taskController.render(newData);
    }

    // this._tasks = [].concat(this._tasks.slice(0, index), newData, this._tasks.slice(index + 1));
    //
    // taskController.render(this._tasks[index]);
  }

  _onViewChange() {
    this._showedTaskControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    let sortedTasks = [];
    const tasks = this._tasksModel.getTasks();

    switch (sortType) {
      case SortType.DATE_UP:
        sortedTasks = tasks.slice().sort((a, b) => a.dueDate - b.dueDate);
        break;
      case SortType.DATE_DOWN:
        sortedTasks = tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
        break;
      case SortType.DEFAULT:
        sortedTasks = tasks.slice(0, this._showingTasksCount);
        break;
    }

    const taskListElement = this._tasksComponent.getElement();
    taskListElement.innerHTML = ``;

    const newTasks = renderTasks(taskListElement, sortedTasks.slice(0, this._showingTasksCount), this._onDataChange, this._onViewChange);
    this._showedTaskControllers = newTasks;
  }

  _onFilterChange() {
    this._removeTasks();
    this._renderTasks(this._tasksModel.getTasks());
    this._renderLoadMoreButton();
  }

  _renderTasks(tasks) {
    const taskListElement = this._tasksComponent.getElement();

    const newTasks = renderTasks(taskListElement, tasks.slice(0, this._showingTasksCount), this._onDataChange, this._onViewChange);
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);
  }

  _removeTasks() {
    const taskListElement = this._tasksComponent.getElement();
    taskListElement.innerHTML = ``;
    this._showedTaskControllers = [];
  }

  _renderLoadMoreButton() {
    this._loadMoreComponent.getElement().remove();
    this._loadMoreComponent.removeElement();

    const tasks = this._tasksModel.getTasks();

    if (this._showingTasksCount >= tasks.length) {
      return;
    }

    render(this._container, this._loadMoreComponent.getElement(), RenderPosition.BEFOREEND);
    this._loadMoreComponent.setClickHandler(() => this._onLoadMoreClick(tasks));
  }

  _onLoadMoreClick(tasks) {
    const prevTasksCount = this._showingTasksCount;

    this._showingTasksCount = this._showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

    this._renderTasks(tasks.slice(prevTasksCount, this._showingTasksCount));

    if (this._showingTasksCount >= tasks.length) {
      this._loadMoreComponent.getElement().remove();
      this._loadMoreComponent.removeElement();
    }
  }

  render() {
    const container = this._container;
    const tasks = this._tasksModel.getTasks();

    if (tasks.length > 0) {
      render(container, this._sortComponent.getElement(), RenderPosition.BEFOREEND);
      render(container, this._tasksComponent.getElement(), RenderPosition.BEFOREEND);

      this._renderTasks(tasks);

      this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    } else {
      render(container, this._noTasksComponent.getElement(), RenderPosition.BEFOREEND);
    }

    this._renderLoadMoreButton();
  }
}
