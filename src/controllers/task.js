import TaskComponent from "../components/task";
import TaskEditComponent from "../components/task-edit";
import {render, RenderPosition} from "../utils";

export default class TaskController {
  constructor(container) {
    this._container = container;
  }

  render(task) {
    const container = this._container;

    this._taskComponent = new TaskComponent(task);
    this._taskEditComponent = new TaskEditComponent(task);

    const replaceEditToTask = () => {
      container.replaceChild(this._taskComponent.getElement(), this._taskEditComponent.getElement());
    };

    const replaceTaskToEdit = () => {
      container.replaceChild(this._taskEditComponent.getElement(), this._taskComponent.getElement());
    };

    const onEscKeyDown = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

      if (isEscKey) {
        replaceEditToTask();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    this._taskComponent.setEditButtonClickHandler(() => {
      replaceTaskToEdit();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    this._taskEditComponent.setSubmitHandler(replaceEditToTask);

    render(container, this._taskComponent.getElement(), RenderPosition.BEFOREEND);
  }
}
