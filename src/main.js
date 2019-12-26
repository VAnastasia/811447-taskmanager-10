const TASK_COUNT = 3;

import {createSiteMenuTemplate} from "./components/site-menu";
import {createFilterTempalate} from "./components/filter";
import {createBoardTemplate} from "./components/board";
import {createTaskTemplate} from "./components/task";
import {createTaskEditTemplate} from "./components/task-edit";
import {createLoadMoreButtonTemplate} from "./components/load-more";
import {tasks} from "./data/data";
console.log(tasks);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElement, createSiteMenuTemplate(), `beforeend`);
render(siteMainElement, createFilterTempalate(), `beforeend`);
render(siteMainElement, createBoardTemplate(), `beforeend`);

const taskListElement = document.querySelector(`.board__tasks`);
render(taskListElement, createTaskEditTemplate(tasks[0]), `beforeend`);

tasks.slice(1, 8).forEach((task) => {
  render(taskListElement, createTaskTemplate(task), `beforeend`);
});

const boardElement = document.querySelector(`.board`);
render(boardElement, createLoadMoreButtonTemplate(), `beforeend`);
