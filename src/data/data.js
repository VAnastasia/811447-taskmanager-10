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

const getRandomDate = () => getRandomBoolean() ? Date.now() - getRandonNumber(0, TIME_WEEK) : Date.now() + getRandonNumber(0, TIME_WEEK);

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

const noRepetingsDays = {
  mo: false,
  tu: false,
  we: false,
  th: false,
  fr: false,
  sa: false,
  su: false,
};

const getTask = () => ({
  description: getRandomItem(DESCRIPTIONS),
  dueDate: getRandomBoolean() ? getRandomDate() : null,
  repeatingsDays: getRandomBoolean() ? getRepeatingDays() : noRepetingsDays,
  tags: getRandomTags(TAGS),
  color: getRandomItem(colors),
  isFavorite: getRandomBoolean(),
  isArchive: getRandomBoolean()
});

const getTasks = (count) =>
  new Array(count).fill(null).map(getTask);

// const filterNames = [
//   `all`, `overdue`, `today`, `favorites`, `repeatings`, `tags`, `archive`
// ];

// const generateFilters = () => {
//   return filterNames.map((it) => {
//     return {
//       name: it,
//       count: 0
//     };
//   });
// };


export const tasks = getTasks(TASKS_AMOUNT);
export const tasksAll = tasks.slice();

const filters = [
  {
    name: `all`,
    count: tasks.length
  },
  {
    name: `overdue`,
    count: tasks.filter((task) => task.dueDate < new Date(Date.now())).length
  },
  {
    name: `today`,
    count: tasks.filter((task) => (new Date(task.dueDate)).getDate() === (new Date(Date.now())).getDate()).length
  },
  {
    name: `favorites`,
    count: tasks.filter((task) => task.isFavorite).length
  },
  {
    name: `repeatings`,
    count: tasks.filter((task) => Object.values(task.repeatingsDays).some((it) => !!it)).length
  },
  {
    name: `tags`,
    count: tasks.filter((task) => task.tags.length > 0).length
  },
  {
    name: `archive`,
    count: tasks.filter((task) => task.isArchive).length
  },
];

export {filters};
