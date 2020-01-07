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

render(siteHeaderElement, new SiteMenuComponent().getElement(), RenderPosition.BEFOREEND);
// render(siteMainElement, new FilterComponent(filters).getElement(), RenderPosition.BEFOREEND);
const filterController = new FilterController(siteMainElement, tasksModel);
filterController.render();

render(siteMainElement, new BoardComponent().getElement(), RenderPosition.BEFOREEND);

const board = document.querySelector(`.board.container`);

new BoardController(board, tasksModel).render();
