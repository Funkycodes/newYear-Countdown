const toMilliSeconds = (unit) => {
  const seconds = 1000;
  const minutes = seconds * 60;
  const hours = minutes * 60;
  const days = hours * 24;

  if (unit === "seconds") return seconds;
  if (unit === "minutes") return minutes;
  if (unit === "hours") return hours;
  if (unit === "days") return days;
};

const daysInAMonth = (date) => {
  const temp = new Date(date);
  temp.setMonth(date.getMonth() + 1);
  temp.setDate(0);
  return temp.getDate();
};

const getMonthDiff = (endDate, startDate) => {
  const yearDiff = endDate.getFullYear() - startDate.getFullYear();
  let diff = endDate.getMonth() + yearDiff * 12 - startDate.getMonth();
  const d = new Date(endDate);
  d.setMonth(endDate.getMonth() - diff);
  if (d < startDate) diff -= 1;

  const daysdiff = Array.from({ length: diff }).map((_, index) => {
    const temp = new Date(startDate);
    const month = temp.getMonth() + index;
    temp.setMonth(month);
    return daysInAMonth(temp);
  });
  const daysElapsedByMonths = daysdiff.reduce((a, b) => a + b);

  return {
    diff,
    daysElapsedByMonths,
    ms: daysElapsedByMonths * toMilliSeconds("days"),
  };
};

const getCountdown = (endDate, startDate) => {
  const {
    diff: months,
    daysElapsedByMonths,
    ms,
  } = getMonthDiff(endDate, startDate);
  const difference = endDate.getTime() - startDate.getTime() - ms;
  const days = Math.floor(difference / toMilliSeconds("days"));
  const hours = Math.floor(
    (difference % toMilliSeconds("days")) / toMilliSeconds("hours")
  );
  const minutes = Math.floor(
    (difference % toMilliSeconds("hours")) / toMilliSeconds("minutes")
  );
  const seconds = Math.floor(
    (difference % toMilliSeconds("minutes")) / toMilliSeconds("seconds")
  );

  return {
    months,
    days,
    hours,
    minutes,
    seconds,
  };
};
const setTargetDate = (date) => {
  const targetDate = document.querySelector(".end__date time");
  targetDate.textContent = date.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
  const formatDate = (dt) => {
    const year = dt.toLocaleString("en-US", { year: "numeric" });
    const month = dt.toLocaleString("en-US", { month: "2-digit" });
    const day = dt.toLocaleString("en-US", { day: "2-digit" });
    return `${year}-${month}-${day}`;
  };
  targetDate.setAttribute("datetime", formatDate(date));
};
const updateTime = (endDate) => {
  const now = new Date();
  const values = getCountdown(endDate, now);

  const boxes = document.querySelectorAll(".timer-box");
  boxes.forEach((box) => {
    const { unit } = box.dataset;
    const value = values[unit];
    box.firstElementChild.textContent = value;
  });
};

const endDate = new Date(0);
const endYear = new Date().getFullYear()
endDate.setYear(endYear + 1)
/**
 * setInterval((_) => {
 * console.clear();
 * console.log(
 * new Date().toLocaleString("en-US", {
 * hour: "numeric",
 * minute: "numeric",
 * second: "numeric",
 * })
 * );
 * }, 1000);
 */

setTargetDate(endDate);
updateTime(endDate);
setInterval(updateTime, 1000, endDate);
