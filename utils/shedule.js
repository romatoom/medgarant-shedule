import {
  convertToMinutes,
  convertToHHMM,
  convertTimesRanges,
} from "./converter.js";

export default class Shedule {
  #startWorkTime;
  #stopWorkTime;
  #allowTimeRangesIntersections;
  #busyTimesRanges;

  constructor({
    startWorkTimeHHMM,
    stopWorkTimeHHMM,
    allowTimeRangesIntersections = false,
  }) {
    this.#startWorkTime = convertToMinutes(startWorkTimeHHMM);
    this.#stopWorkTime = convertToMinutes(stopWorkTimeHHMM);
    this.#allowTimeRangesIntersections = allowTimeRangesIntersections;
    this.#busyTimesRanges = [];
  }

  addBusyTimesRanges(busyTimesRanges) {
    this.#busyTimesRanges = [
      ...this.#busyTimesRanges,
      ...convertTimesRanges(busyTimesRanges, convertToMinutes),
    ];

    this.#normalizeBusyTimesRanges();
  }

  busyTimesRanges() {
    return convertTimesRanges(this.#busyTimesRanges, convertToHHMM);
  }

  freeTimesRanges() {
    return convertTimesRanges(this.#listOfFreeTimes(), convertToHHMM);
  }

  freeSlotsTimesRanges(minutesForFreeSlots) {
    const freeSlots = [];

    for (const range of this.#listOfFreeTimes()) {
      let start = range.start;
      let stop = start + minutesForFreeSlots;

      while (stop <= range.stop) {
        freeSlots.push({
          start: convertToHHMM(start),
          stop: convertToHHMM(stop),
        });

        start = stop;
        stop = start + minutesForFreeSlots;
      }
    }

    return freeSlots;
  }

  #getBusyTimesScale() {
    const BUSY_INERT = 0;
    const BUSY_START = 1;
    const BUSY_STOP = -1;

    const busyTimesScale = {
      [this.#startWorkTime]: [BUSY_INERT],
      [this.#stopWorkTime]: [BUSY_INERT],
    };

    for (const range of this.#busyTimesRanges) {
      const start = range.start;
      const stop = range.stop;

      if (
        start < this.#startWorkTime ||
        start > this.endWorkTime ||
        stop < this.#startWorkTime ||
        stop > this.endWorkTime
      ) {
        throw Error(
          `Time must be in the range from ${convertToHHMM(
            this.#startWorkTime
          )} to ${convertToHHMM(this.endWorkTime)}`
        );
      }

      busyTimesScale[start] = busyTimesScale[start]
        ? [...busyTimesScale[start], BUSY_START]
        : [BUSY_START];

      busyTimesScale[stop] = busyTimesScale[stop]
        ? [...busyTimesScale[stop], BUSY_STOP]
        : [BUSY_STOP];
    }

    return busyTimesScale;
  }

  #normalizeBusyTimesRanges() {
    const normalizedBusyTimes = [];
    let isBusy = 0;
    let busyStart;

    for (const [minutesKey, busyDiffs] of Object.entries(
      this.#getBusyTimesScale()
    )) {
      const minutes = Number(minutesKey);
      const diff = busyDiffs.reduce((el, acc) => acc + el, 0);

      isBusy += diff;

      if (isBusy > 1 && !this.#allowTimeRangesIntersections) {
        throw Error("Intersection of time ranges detected!");
      }

      // Event: start of busy time
      if (isBusy > 0 && isBusy === diff) {
        busyStart = minutes;
        continue;
      }

      // Event: end of busy time
      if (isBusy === 0 && diff < 0) {
        normalizedBusyTimes.push({ start: busyStart, stop: minutes });
      }
    }

    this.#busyTimesRanges = normalizedBusyTimes;
  }

  #listOfFreeTimes() {
    if (this.#busyTimesRanges.length === 0) return [];

    const list = [
      { start: this.#startWorkTime, stop: this.#busyTimesRanges[0].start },
    ];

    for (let i = 1; i < this.#busyTimesRanges.length; i++) {
      list.push({
        start: this.#busyTimesRanges[i - 1].stop,
        stop: this.#busyTimesRanges[i].start,
      });
    }

    list.push({
      start: this.#busyTimesRanges[this.#busyTimesRanges.length - 1].stop,
      stop: this.#stopWorkTime,
    });

    return list;
  }
}
