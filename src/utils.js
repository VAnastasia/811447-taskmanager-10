const dateFormat = new Intl.DateTimeFormat(`en-GB`, {
  month: `long`,
  day: `numeric`
});

const timeFormat = new Intl.DateTimeFormat(`en-GB`, {
  hour12: true,
  hour: `numeric`,
  minute: `numeric`
});

export const formatDate = (date) => dateFormat.format(date).toUpperCase();
export const formatTime = (date) => timeFormat.format(date).toUpperCase();

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const render = (container, template, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(template);
      break;
    case RenderPosition.BEFOREEND:
      container.append(template);
      break;
  }
};
