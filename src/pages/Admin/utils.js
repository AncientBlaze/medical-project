export const fmt = (d) => {
  const options = { day: '2-digit', month: 'short', year: '2-digit' };
  const date = new Date(d);
  const formattedDate = new Intl.DateTimeFormat('en-IN', options).format(date);
  return formattedDate;
};