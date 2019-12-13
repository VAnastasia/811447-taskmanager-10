const createTaskTemplate = ({
  color = `black`,
  description,
  dueDate,
  isArchive,
  isFavorite,
  repeatingsDays,
}) => {
  return `<article class="card card--${color}">
      <div class="card__form">
        <div class="card__inner">
          <div class="card__control">
            <button type="button" class="card__btn card__btn--edit">
              edit
            </button>
            <button type="button" class="card__btn card__btn--archive">
              archive
            </button>
            <button
              type="button"
              class="card__btn card__btn--favorites card__btn--disabled"
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
                    <span class="card__date">${dueDate}</span>
                    <span class="card__time">${dueDate}</span>
                  </p>
                </div>
              </div>
              <div class="card__hashtag">
                <div class="card__hashtag-list">
                  <span class="card__hashtag-inner">
                    <span class="card__hashtag-name">
                      #todo
                    </span>
                  </span>
                  <span class="card__hashtag-inner">
                    <span class="card__hashtag-name">
                      #personal
                    </span>
                  </span>
                  <span class="card__hashtag-inner">
                    <span class="card__hashtag-name">
                      #important
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>`;
};

export {createTaskTemplate};
