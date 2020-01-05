import AbstractSmartComponent from './abstract-smart-component.js';
import {formatDate, formatTime} from "../utils";
import {TaskColor} from "../data/constants";

const createTaskEditTemplate = (task, options) => {
  const {description, color, tags, dueDate, repeatingsDays} = task;
  const {isDateShowing, isRepeatingTask, activeRepeatingDays} = options;

  const isExpired = dueDate < new Date(Date.now());

  // const isRepeatingTask = Object.keys(repeatingsDays).some((day) => repeatingsDays[day]);

  const isRepeating = (days) => {
    return Object.keys(days).some((day) => days[day]);
  };

  const repeatClass = isRepeating(repeatingsDays) ? `card--repeat` : ``;
  const deadlineClass = isExpired ? `card--deadline` : ``;

  return `<article class="card card--edit card--${color} ${repeatClass} ${deadlineClass}">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>
          <div class="card__textarea-wrap">
            <label>
              <textarea
                class="card__text"
                placeholder="Start typing your text here..."
                name="text"
              >${description}</textarea>
            </label>
          </div>
          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <button class="card__date-deadline-toggle" type="button">
                  date: <span class="card__date-status">${isDateShowing ? `yes` : `no`}</span>
                </button>
                ${isDateShowing ?
                  `<fieldset class="card__date-deadline">
                    <label class="card__input-deadline-wrap">
                      <input
                        class="card__date"
                        type="text"
                        placeholder=""
                        name="date"
                        value="${formatDate(dueDate)} ${formatTime(dueDate)}"
                      />
                    </label>
                  </fieldset/>` : ``}

                <button class="card__repeat-toggle" type="button">
                  repeat:<span class="card__repeat-status">${isRepeatingTask ? `yes` : `no`}</span>
                </button>
                ${isRepeatingTask ?
                    `<fieldset class="card__repeat-days">
                    <div class="card__repeat-days-inner">
                    ${(Object.keys(repeatingsDays).map((day) => (
                      `<input
                          class="visually-hidden card__repeat-day-input"
                          type="checkbox"
                          id="repeat-${day}-4"
                          name="repeat"
                          value="${day}"
                          ${repeatingsDays[day] ? `checked` : ``}
                        />
                        <label class="card__repeat-day" for="repeat-${day}-4"
                          >${day}</label
                        >`.trim()
                    ))).join(``)}

                    </div>
                  </fieldset>` : ``}

              </div>
              <div class="card__hashtag">
                <div class="card__hashtag-list">

                ${(Array.from(tags).map((tag) => (
    `<span class="card__hashtag-inner">
    <input
      type="hidden"
      name="hashtag"
      value="${tag}"
      class="card__hashtag-hidden-input"
    />
    <p class="card__hashtag-name">
      #${tag}
    </p>
    <button type="button" class="card__hashtag-delete">
      delete
    </button>
  </span>`.trim()
  ))).join(``)}

                </div>
                <label>
                  <input
                    type="text"
                    class="card__hashtag-input"
                    name="hashtag-input"
                    placeholder="Type new hashtag here"
                  />
                </label>
              </div>
            </div>
            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
              ${(Object.keys(TaskColor).map((colorItem) => (
    `<input
      type="radio"
      id="color-${colorItem.toLowerCase()}-4"
      class="card__color-input card__color-input--${colorItem.toLowerCase()} visually-hidden"
      name="color"
      value="${colorItem.toLowerCase()}"
      ${TaskColor[colorItem] === color ? `checked` : ``}
      />
      <label
      for="color-${colorItem.toLowerCase()}-4"
      class="card__color card__color--${colorItem.toLowerCase()}"
      >${colorItem.toLowerCase()}</label
      >`.trim()
  ))).join(``)}

              </div>
            </div>
          </div>
          <div class="card__status-btns">
            <button class="card__save" type="submit">save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>`;
};

export default class TaskEditComponent extends AbstractSmartComponent {
  constructor(task) {
    super();
    this._task = task;
    this._isDateShowing = !!task.dueDate;
    this._isRepeatingTask = Object.values(task.repeatingsDays).some(Boolean);
    this._activeRepeatingDays = Object.assign({}, task.repeatingsDays);

    this._subscribeOnEvents();
    this._submitHandler = null;
  }

  getTemplate() {
    return createTaskEditTemplate(this._task, {
      isDateShowing: this._isDateShowing,
      isRepeatingTask: this._isRepeatingTask,
      activeRepeatingDays: this._activeRepeatingDays,
    });
  }

  recoveryListeners() {
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();

    // this._applyFlatpickr();
  }

  reset() {
    const task = this._task;

    this._isDateShowing = !!task.dueDate;
    this._isRepeatingTask = Object.values(task.repeatingsDays).some(Boolean);
    this._activeRepeatingDays = Object.assign({}, task.repeatingsDays);

    this.rerender();
  }

  setSubmitHandler(handler) {
    this.getElement().querySelector(`form`)
      .addEventListener(`submit`, handler);

    this._submitHandler = handler;
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.card__date-deadline-toggle`)
     .addEventListener(`click`, () => {
       this._isDateShowing = !this._isDateShowing;

       this.rerender();
     });

    element.querySelector(`.card__repeat-toggle`)
     .addEventListener(`click`, () => {
       this._isRepeatingTask = !this._isRepeatingTask;

       this.rerender();
     });

    const repeatDays = element.querySelector(`.card__repeat-days`);
    if (repeatDays) {
      repeatDays.addEventListener(`change`, (evt) => {

        this._activeRepeatingDays[evt.target.value] = !this._activeRepeatingDays[evt.target.value];

        this.rerender();
      });
    }
  }

}
