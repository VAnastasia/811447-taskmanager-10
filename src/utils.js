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
