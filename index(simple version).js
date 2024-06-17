/*

Упрощенный вариант.

Если мы точно знаем, что на входе мы принимаем непересекающиеся временные диапазоны

*/

import { convertToMinutes, convertToHHMM } from "./utils/converter.js";

class SimpleShedule {
  constructor(startWorkTime, stopWorkTime) {
    this.startWorkTime = convertToMinutes(startWorkTime);
    this.stopWorkTime = convertToMinutes(stopWorkTime);
    this.busyTimesRanges = [];
  }

  addBusyTimesRanges(busyTimesRanges) {
    this.busyTimesRanges = [
      ...this.busyTimesRanges,
      ...busyTimesRanges.map(({ start, stop }) => ({
        start: convertToMinutes(start),
        stop: convertToMinutes(stop),
      })),
    ];
  }

  listOfFreeTimes() {
    const sortedBusyTimesRanges = this.busyTimesRanges.sort((prev, next) =>
      prev.start > next.start ? 1 : -1
    );

    const list = [
      { start: this.startWorkTime, stop: sortedBusyTimesRanges[0].start },
    ];

    for (let i = 1; i < sortedBusyTimesRanges.length; i++) {
      list.push({
        start: sortedBusyTimesRanges[i - 1].stop,
        stop: sortedBusyTimesRanges[i].start,
      });
    }

    list.push({
      start: sortedBusyTimesRanges[sortedBusyTimesRanges.length - 1].stop,
      stop: this.stopWorkTime,
    });

    return list;
  }

  freeWindowsTimesRanges(minutesForFreeWindows) {
    const freeWindows = [];

    for (const range of this.listOfFreeTimes()) {
      let start = range.start;
      let stop = start + minutesForFreeWindows;

      while (stop <= range.stop) {
        freeWindows.push({
          start: convertToHHMM(start),
          stop: convertToHHMM(stop),
        });

        start = stop;
        stop = start + minutesForFreeWindows;
      }
    }

    return freeWindows;
  }
}

const busy = [
  { start: "10:30", stop: "10:50" },
  { start: "18:40", stop: "18:50" },
  { start: "14:40", stop: "15:50" },
  { start: "16:40", stop: "17:20" },
  { start: "20:05", stop: "20:20" },
];

try {
  const shedule = new SimpleShedule("09:00", "21:00");

  shedule.addBusyTimesRanges(busy);

  const minutesForFreeSlots = 30;

  const freeWindowsTimesRanges =
    shedule.freeWindowsTimesRanges(minutesForFreeSlots);

  console.log(freeWindowsTimesRanges);
} catch (err) {
  console.error(err);
}
