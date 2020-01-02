const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

import SiteMenuComponent from "../components/site-menu";
import FilterComponent from "../components/filter";
import BoardComponent from "../components/board";
import SortComponent from "../components/sort";
import TaskComponent from "../components/task";
import NoTasksComponent from "../components/no-tasks";
import TasksComponent from "../components/tasks";
import TaskEditComponent from "../components/task-edit";
import LoadMoreComponent from "../components/load-more";
import {filters} from "../data/data";
import {render, RenderPosition} from "../utils";

const renderTask = (task) => {
  const taskComponent = new TaskComponent(task);
  const taskEditComponent = new TaskEditComponent(task);

  const replaceEditToTask = () => {
    taskListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  };

  const replaceTaskToEdit = () => {
    taskListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToTask();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  taskComponent.setEditButtonClickHandler(() => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  taskEditComponent.setSubmitHandler(replaceEditToTask);

  const taskListElement = document.querySelector(`.board__tasks`);

  render(taskListElement, taskComponent.getElement(), RenderPosition.BEFOREEND);
};


export default class BoardController {
  constructor(container) {
    this._container = container;

    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreComponent = new LoadMoreComponent();
  }

  render(tasks) {
    const container = this._container;
    let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

    if (tasks.length > 0) {
      render(container, this._sortComponent.getElement(), RenderPosition.BEFOREEND);
      render(container, this._tasksComponent.getElement(), RenderPosition.BEFOREEND);

      tasks.slice(0, showingTasksCount).forEach(renderTask);
    } else {
      render(container, this._noTasksComponent.getElement(), RenderPosition.BEFOREEND);
    }

    const boardElement = document.querySelector(`.board`);


    if (tasks.length > SHOWING_TASKS_COUNT_ON_START) {
      render(boardElement, this._loadMoreComponent.getElement(), RenderPosition.BEFOREEND);
    }

    this._loadMoreComponent.setClickHandler(() => {
      const prevTasksCount = showingTasksCount;
      showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

      tasks.slice(prevTasksCount, showingTasksCount)
        .forEach(renderTask);

      if (showingTasksCount >= tasks.length) {
        this._loadMoreComponent.getElement().remove();
        this._loadMoreComponent.removeElement();
      }
    });
  }
}
