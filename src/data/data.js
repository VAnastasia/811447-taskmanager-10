import {
  TaskDay,
  TaskColor,
  DESCRIPTIONS,
  TAGS,
  TIME_WEEK,
  TASKS_AMOUNT
} from './constants';

const colors = Object.values(TaskColor);

const shuffleArray = (array) => {
  let j;
  let temp;
  for (let i = array.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = array[j];
    array[j] = array[i];
    array[i] = temp;
  }
  return array;
};

const getRandonNumber = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min;

const getRandomItem = (array) =>
  array[Math.floor(Math.random() * array.length)];

const getRandomDate = () =>
  Date.now() - getRandonNumber(0, TIME_WEEK);

const getRandomBoolean = (chance = 0.5) =>
  Math.random() > chance;

const days = Object.values(TaskDay);

const repeatDayReducer = (week, day) => {
  week[day] = getRandomBoolean();
  return week;
};

const getRepeatingDays = () =>
  days.reduce(repeatDayReducer, {});

const getRandomTags = ([...tags], num = getRandonNumber(0, 3)) =>
  shuffleArray(tags).slice(0, num);

const getTask = () => ({
  description: getRandomItem(DESCRIPTIONS),
  dueDate: getRandomDate(),
  repeatingsDays: getRepeatingDays(),
  tags: getRandomTags(TAGS),
  color: getRandomItem(colors),
  isFavorite: getRandomBoolean(),
  isArchive: getRandomBoolean()
});

const getTasks = (count) =>
  new Array(count).fill(null).map(getTask);

const filterNames = [
  `all`, `overdue`, `today`, `favorites`, `repeatings`, `tags`, `archive`
];

const generateFilters = () => {
  return filterNames.map((it) => {
    return {
      name: it,
      count: Math.floor(Math.random() * 10)
    };
  });
};

const filters = generateFilters();

export const tasks = getTasks(TASKS_AMOUNT);
export const tasksAll = tasks.slice();

export {filters};
