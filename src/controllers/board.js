const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

import SortComponent, {SortType} from "../components/sort";
import NoTasksComponent from "../components/no-tasks";
import TasksComponent from "../components/tasks";
import LoadMoreComponent from "../components/load-more";
import {render, RenderPosition} from "../utils";
import TaskController from "./task";
import TasksModel from "../models/tasks";

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


  render() {
    const container = this._container;
    const tasks = this._tasksModel.getTasks();
    // let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

    // const isAllTasksArchived = this._tasks.every((task) => task.isArchive);

    if (tasks.length > 0) {
      render(container, this._sortComponent.getElement(), RenderPosition.BEFOREEND);
      render(container, this._tasksComponent.getElement(), RenderPosition.BEFOREEND);
      const taskListElement = this._tasksComponent.getElement();

      const newTasks = renderTasks(taskListElement, tasks.slice(0, this._showingTasksCount), this._onDataChange, this._onViewChange);
      this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

      this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
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

      const newTasks = renderTasks(taskListElement, tasks.slice(prevTasksCount, this._showingTasksCount), this._onDataChange, this._onViewChange);
      this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

      if (this._showingTasksCount >= tasks.length) {
        this._loadMoreComponent.getElement().remove();
        this._loadMoreComponent.removeElement();
      }
    });
  }
}
