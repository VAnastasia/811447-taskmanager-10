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
  constructor(container) {
    this._container = container;

    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreComponent = new LoadMoreComponent();

    this._tasks = [];
    this._showedTaskControllers = [];
    this._showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  _onDataChange(taskController, oldData, newData) {
    const index = this._tasks.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._tasks = [].concat(this._tasks.slice(0, index), newData, this._tasks.slice(index + 1));

    taskController.render(this._tasks[index]);
  }

  _onViewChange() {
    this._showedTaskControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    let sortedTasks = this._tasks.slice();
    switch (sortType) {
      case SortType.DATE_UP:
        sortedTasks = this._tasks.slice().sort((a, b) => a.dueDate - b.dueDate);
        break;
      case SortType.DATE_DOWN:
        sortedTasks = this._tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
        break;
      case SortType.DEFAULT:
        sortedTasks = this._tasks.slice(0, this._showingTasksCount);
        break;
    }

    const taskListElement = this._tasksComponent.getElement();
    taskListElement.innerHTML = ``;

    const newTasks = renderTasks(taskListElement, sortedTasks, this._onDataChange, this._onViewChange);
    this._showedTaskControllers = newTasks;
  }


  render(tasks) {
    const container = this._container;
    this._tasks = tasks;
    // let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

    // const isAllTasksArchived = this._tasks.every((task) => task.isArchive);

    if (tasks.length > 0) {
      render(container, this._sortComponent.getElement(), RenderPosition.BEFOREEND);
      render(container, this._tasksComponent.getElement(), RenderPosition.BEFOREEND);
      const taskListElement = this._tasksComponent.getElement();

      const newTasks = renderTasks(taskListElement, this._tasks.slice(0, this._showingTasksCount), this._onDataChange, this._onViewChange);
      this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

      // this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);

      // renderTasks(taskListElement, this._tasks.slice(0, showingTasksCount), this._onDataChange, this._onViewChange);
    } else {
      render(container, this._noTasksComponent.getElement(), RenderPosition.BEFOREEND);
    }

    const boardElement = document.querySelector(`.board`);

    if (tasks.length > SHOWING_TASKS_COUNT_ON_START) {
      render(boardElement, this._loadMoreComponent.getElement(), RenderPosition.BEFOREEND);
    }

    this._loadMoreComponent.setClickHandler(() => {
      const prevTasksCount = this._showingTasksCount;
      this._showingTasksCount = this._showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;
      const taskListElement = this._tasksComponent.getElement();

      const newTasks = renderTasks(taskListElement, this._tasks.slice(prevTasksCount, this._showingTasksCount), this._onDataChange, this._onViewChange);
      this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

      if (this._showingTasksCount >= tasks.length) {
        this._loadMoreComponent.getElement().remove();
        this._loadMoreComponent.removeElement();
      }
    });
  }
}
