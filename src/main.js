import BoardController from "./controllers/board";
import SiteMenuComponent, {MenuItem} from "./components/site-menu";
import StatisticsComponent from './components/statistics.js';
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
const statisticsComponent = new StatisticsComponent();

const filterController = new FilterController(siteMainElement, tasksModel);
filterController.render();

const boardComponent = new BoardComponent();

render(siteMainElement, boardComponent.getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, statisticsComponent.getElement(), RenderPosition.BEFOREEND);

// const board = document.querySelector(`.board.container`);
const boardController = new BoardController(boardComponent, tasksModel);

render(siteHeaderElement, siteMenuComponent.getElement(), RenderPosition.BEFOREEND);

statisticsComponent.hide();
boardController.render();

siteMenuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_TASK:
      siteMenuComponent.setActiveItem(MenuItem.TASKS);
      statisticsComponent.hide();
      boardController.show();
      boardController.createTask();
      break;
    case MenuItem.STATISTICS:
      boardController.hide();
      statisticsComponent.show();
      break;
    case MenuItem.TASKS:
      statisticsComponent.hide();
      boardController.show();
      break;
  }
});
