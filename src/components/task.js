import {formatTime, formatDate} from "../utils";
import AbstractComponent from "./abstract-component";

const createTaskTemplate = ({
  color = `black`,
  description,
  dueDate,
  isArchive,
  isFavorite,
  repeatingsDays,
  tags
}) => {
  return `<article class="card card--${color} ${Object.keys(repeatingsDays).some((day) => repeatingsDays[day]) ? `card--repeat` : ``} ${dueDate < new Date(Date.now()) ? `card--deadline` : ``}">
      <div class="card__form">
        <div class="card__inner">
          <div class="card__control">
            <button type="button" class="card__btn card__btn--edit">
              edit
            </button>
            <button type="button" class="card__btn ${isArchive ? `card__btn--archive` : ``}">
              archive
            </button>
            <button
              type="button"
              class="card__btn ${isFavorite ? `card__btn--favorites` : ``} card__btn--disabled"
            >
              favorites
            </button>
          </div>
          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>
          <div class="card__textarea-wrap">
            <p class="card__text">${description}</p>
          </div>
          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <div class="card__date-deadline">
                  <p class="card__input-deadline-wrap">
                    <span class="card__date">${formatDate(dueDate)}</span>
                    <span class="card__time">${formatTime(dueDate)}</span>
                  </p>
                </div>
              </div>
              <div class="card__hashtag">
                <div class="card__hashtag-list">
                ${(Array.from(tags).map((tag) => (
    `<span class="card__hashtag-inner">
      <input type="hidden" name="hashtag" value="${tag}" class="card__hashtag-hidden-input" />
      <button type="button" class="card__hashtag-name">#${tag}</button>
      <button type="button" class="card__hashtag-delete">delete</button>
    </span>`.trim()
  ))).join(``)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>`;
};

export default class TaskComponent extends AbstractComponent {
  constructor(task) {
    super();
    this._task = task;
  }

  getTemplate() {
    return createTaskTemplate(this._task);
  }

  setEditButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--edit`)
     .addEventListener(`click`, handler);
  }
}
