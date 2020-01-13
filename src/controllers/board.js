const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

import SortComponent, {SortType} from "../components/sort";
import NoTasksComponent from "../components/no-tasks";
import TasksComponent from "../components/tasks";
import LoadMoreComponent from "../components/load-more";
import {render, RenderPosition} from "../utils";
import TaskController, {Mode as TaskControllerMode, EmptyTask} from "./task";

const renderTasks = (taskListElement, tasks, onDataChange, onViewChange) => {
  return tasks.map((task) => {
    const taskController = new TaskController(taskListElement, onDataChange, onViewChange);
    taskController.render(task, TaskControllerMode.DEFAULT);

    return taskController;
  });
};

export default class BoardController {
  constructor(container, tasksModel, api) {
    this._container = container;
    this._tasksModel = tasksModel;
    this._api = api;

    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreComponent = new LoadMoreComponent();
    this._creatingTask = null;

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
    if (oldData === EmptyTask) {
      this._creatingTask = null;
      if (newData === null) {
        taskController.destroy();
        this._updateTasks(this._showingTasksCount);
      } else {
        this._api.createTask(newData)
          .then((taskModel) => {
            this._tasksModel.addTask(taskModel);
            taskController.render(taskModel, TaskControllerMode.DEFAULT);

            const destroyedTask = this._showedTaskControllers.pop();
            destroyedTask.destroy();

            this._showedTaskControllers = [].concat(taskController, this._showedTaskControllers);
            this._showingTasksCount = this._showedTaskControllers.length;
          })
          .catch(() => {
            // taskController.shake();
          });
      }
    } else if (newData === null) {
      this._api.deleteTask(oldData.id)
        .then(() => {
          this._tasksModel.removeTask(oldData.id);
          this._updateTasks(this._showingTasksCount);
        })
        .catch(() => {
          // taskController.shake();
        });
    } else {
      this._api.updateTask(oldData.id, newData)
        .then((taskModel) => {
          const isSuccess = this._tasksModel.updateTask(oldData.id, taskModel);

          if (isSuccess) {
            taskController.render(taskModel, TaskControllerMode.DEFAULT);
            this._updateTasks(this._showingTasksCount);
          }
        })
        .catch(() => {
          // taskController.shake();
        });
    }
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
    // this._removeTasks();
    // this._renderTasks(this._tasksModel.getTasks());
    // this._renderLoadMoreButton();

    this._updateTasks();
  }

  _updateTasks() {
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
    this._showedTaskControllers.forEach((taskController) => taskController.destroy());
    this._showedTaskControllers = [];
  }

  _renderLoadMoreButton() {
    this._loadMoreComponent.getElement().remove();
    this._loadMoreComponent.removeElement();

    const tasks = this._tasksModel.getTasks();

    if (this._showingTasksCount >= tasks.length) {
      return;
    }

    render(this._container.getElement(), this._loadMoreComponent.getElement(), RenderPosition.BEFOREEND);
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

  createTask() {
    if (this._creatingTask) {
      return;
    }

    const taskListElement = this._tasksComponent.getElement();
    this._creatingTask = new TaskController(taskListElement, this._onDataChange, this._onViewChange);
    this._creatingTask.render(EmptyTask, TaskControllerMode.ADDING);
  }

  hide() {
    this._container.hide();
  }

  show() {
    this._container.show();
  }

  render() {
    const container = this._container;
    const tasks = this._tasksModel.getTasks();

    if (tasks.length > 0) {
      render(container.getElement(), this._sortComponent.getElement(), RenderPosition.BEFOREEND);
      render(container.getElement(), this._tasksComponent.getElement(), RenderPosition.BEFOREEND);

      this._renderTasks(tasks);

      this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    } else {
      render(container.getElement(), this._noTasksComponent.getElement(), RenderPosition.BEFOREEND);
    }

    this._renderLoadMoreButton();
  }
}
