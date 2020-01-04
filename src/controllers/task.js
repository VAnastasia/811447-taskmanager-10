import TaskComponent from "../components/task";
import TaskEditComponent from "../components/task-edit";
import {render, RenderPosition} from "../utils";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`
};

export default class TaskController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;
    this._taskComponent = null;
    this._taskEditComponent = null;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  _replaceEditToTask() {
    this._container.replaceChild(this._taskComponent.getElement(), this._taskEditComponent.getElement());
  }

  _replaceTaskToEdit() {
    this._container.replaceChild(this._taskEditComponent.getElement(), this._taskComponent.getElement());
  }

  render(task) {
    const container = this._container;

    // const oldTaskComponent = this._taskComponent;
    // const oldTaskEditComponent = this._taskEditComponent;

    this._taskComponent = new TaskComponent(task);
    this._taskEditComponent = new TaskEditComponent(task);

    this._taskComponent.setEditButtonClickHandler(() => {
      this._replaceTaskToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._taskEditComponent.setSubmitHandler(this._replaceEditToTask);

    render(container, this._taskComponent.getElement(), RenderPosition.BEFOREEND);
  }
}
