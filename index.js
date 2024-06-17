/*

Общий случай

Вариант, когда мы не уверены, что на вход передаются непересекающиеся временные диапазоны

allowTimeRangesIntersections - разрешать ли пересечение временных диапазонов
  если false - при обнаружении пересечения будет выброшена ошибка,
  если true - временные интервалы будут объединены

*/

import Shedule from "./utils/shedule.js";
import printTimesRanges from "./utils/printTimesRanges.js";

try {
  const shedule = new Shedule({
    startWorkTimeHHMM: "09:00",
    stopWorkTimeHHMM: "21:00",
    allowTimeRangesIntersections: true,
  });

  const busy = [
    { start: "10:30", stop: "10:50" },
    { start: "18:40", stop: "18:50" },
    { start: "14:40", stop: "15:50" },
    { start: "16:40", stop: "17:20" },
    { start: "20:05", stop: "20:20" },
  ];

  shedule.addBusyTimesRanges(busy);

  printTimesRanges({
    timesRanges: shedule.busyTimesRanges(),
    description: "List of busy times",
  });

  printTimesRanges({
    timesRanges: shedule.freeTimesRanges(),
    description: "List of all free times",
  });

  const minutesForFreeSlots = 30;
  printTimesRanges({
    timesRanges: shedule.freeSlotsTimesRanges(minutesForFreeSlots),
    description: `List of free slots of ${minutesForFreeSlots} minutes`,
  });
} catch (err) {
  console.error(err);
}
