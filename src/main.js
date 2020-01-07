import BoardController from "./controllers/board";
import SiteMenuComponent from "./components/site-menu";
import BoardComponent from "./components/board";
import {render, RenderPosition} from "./utils";
import {tasksAll} from "./data/data";
import TasksModel from "./models/tasks";
import FilterController from "./controllers/filter";

const tasksModel = new TasksModel();
tasksModel.setTasks(tasksAll);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
const siteMenuComponent = new SiteMenuComponent();

const filterController = new FilterController(siteMainElement, tasksModel);
filterController.render();

render(siteMainElement, new BoardComponent().getElement(), RenderPosition.BEFOREEND);

const board = document.querySelector(`.board.container`);
const boardController = new BoardController(board, tasksModel);

render(siteHeaderElement, siteMenuComponent.getElement(), RenderPosition.BEFOREEND);

siteMenuComponent.getElement().querySelector(`.control__label--new-task`)
  .addEventListener(`click`, () => {
    boardController.createTask();
  });

boardController.render();
