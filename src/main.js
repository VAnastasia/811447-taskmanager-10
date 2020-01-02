import BoardController from "./controllers/board";
import SiteMenuComponent from "./components/site-menu";
import BoardComponent from "./components/board";
import FilterComponent from "./components/filter";
import {render, RenderPosition} from "./utils";
import {tasksAll, filters} from "./data/data";


const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElement, new SiteMenuComponent().getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new FilterComponent(filters).getElement(), RenderPosition.BEFOREEND);


render(siteMainElement, new BoardComponent().getElement(), RenderPosition.BEFOREEND);
const board = document.querySelector(`.board.container`);

new BoardController(board).render(tasksAll);
