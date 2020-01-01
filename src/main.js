// const TASK_COUNT = 3;
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

import SiteMenuComponent from "./components/site-menu";
import FilterComponent from "./components/filter";
import BoardComponent from "./components/board";
import TaskComponent from "./components/task";
import TaskEditComponent from "./components/task-edit";
import LoadMoreComponent from "./components/load-more";
import {tasks, filters} from "./data/data";
import {render, RenderPosition} from "./utils";

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

  const editButton = taskComponent.getElement().querySelector(`.card__btn--edit`);
  editButton.addEventListener(`click`, () => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const editForm = taskEditComponent.getElement().querySelector(`form`);
  editForm.addEventListener(`submit`, replaceEditToTask);

  render(taskListElement, taskComponent.getElement(), RenderPosition.BEFOREEND);
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElement, new SiteMenuComponent().getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new FilterComponent(filters).getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new BoardComponent().getElement(), RenderPosition.BEFOREEND);

const taskListElement = document.querySelector(`.board__tasks`);

let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
tasks.slice(0, showingTasksCount).forEach(renderTask);

const boardElement = document.querySelector(`.board`);
render(boardElement, new LoadMoreComponent().getElement(), RenderPosition.BEFOREEND);

const loadMoreButton = boardElement.querySelector(`.load-more`);
loadMoreButton.addEventListener(`click`, () => {
  const prevTasksCount = showingTasksCount;
  showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

  tasks.slice(prevTasksCount, showingTasksCount)
    .forEach(renderTask);

  if (showingTasksCount >= tasks.length) {
    loadMoreButton.remove();
  }
});
