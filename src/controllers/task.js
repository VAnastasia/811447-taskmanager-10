import TaskComponent from "../components/task";
import TaskEditComponent from "../components/task-edit";
import {render, replace, remove, RenderPosition} from "../utils";

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`
};

export const EmptyTask = {
  description: ``,
  dueDate: null,
  repeatingsDays: {
    mo: false,
    tu: false,
    we: false,
    th: false,
    fr: false,
    sa: false,
    su: false,
  },
  tags: [],
  color: `black`,
  isFavorite: false,
  isArchive: false
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
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyTask, null);
      }

      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  _replaceEditToTask() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._taskEditComponent.reset();

    this._container.replaceChild(this._taskComponent.getElement(), this._taskEditComponent.getElement());

    this._mode = Mode.DEFAULT;
  }

  _replaceTaskToEdit() {
    this._onViewChange();

    this._container.replaceChild(this._taskEditComponent.getElement(), this._taskComponent.getElement());

    this._mode = Mode.EDIT;
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToTask();
    }
  }

  destroy() {
    remove(this._taskEditComponent);
    remove(this._taskComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  render(task, mode = Mode.DEFAULT) {
    const oldTaskComponent = this._taskComponent;
    const oldTaskEditComponent = this._taskEditComponent;
    this._mode = mode;

    this._taskComponent = new TaskComponent(task);
    this._taskEditComponent = new TaskEditComponent(task);

    this._taskComponent.setEditButtonClickHandler(() => {
      this._replaceTaskToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._taskComponent.setArchiveButtonClickHandler(() => {
      this._onDataChange(this, task, Object.assign({}, task, {
        isArchive: !task.isArchive
      }));
    });

    this._taskComponent.setFavoritesButtonClickHandler(() => {
      this._onDataChange(this, task, Object.assign({}, task, {
        isFavorite: !task.isFavorite,
      }));
    });

    this._taskEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._taskEditComponent.getData();
      this._onDataChange(this, task, data);
      this._replaceEditToTask();
    });

    // this._taskEditComponent.setDeleteButtonClickHandler(() => this._onDataChange(this, task, null));

    // if (oldTaskComponent) {
    //   this._container.replaceChild(this._taskComponent.getElement(), oldTaskComponent.getElement());
    //   this._container.replaceChild(this._taskEditComponent.getElement(), oldTaskEditComponent.getElement());
    // } else if (oldTaskEditComponent) {
    //   this._container.replaceChild(this._taskEditComponent.getElement(), oldTaskEditComponent.getElement());
    // } else {
    //   render(this._container, this._taskComponent.getElement(), RenderPosition.BEFOREEND);
    // }

    switch (mode) {
      case Mode.DEFAULT:
        if (oldTaskEditComponent && oldTaskComponent) {
          replace(this._taskComponent, oldTaskComponent);
          replace(this._taskEditComponent, oldTaskEditComponent);
          this._replaceEditToTask();
        } else {
          render(this._container, this._taskComponent.getElement(), RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldTaskEditComponent && oldTaskComponent) {
          remove(oldTaskComponent);
          remove(oldTaskEditComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._taskEditComponent.getElement(), RenderPosition.AFTERBEGIN);
        break;
    }
  }
}
