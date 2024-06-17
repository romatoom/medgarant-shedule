function convertToMinutes(hh_mm) {
  const regexp = /\d{2}:\d{2}/;
  const match = regexp.test(hh_mm);

  if (!match) {
    throw Error(`Invalid time format (${hh_mm})`);
  }

  const [hh, mm] = hh_mm.split(":").map((el) => parseInt(el));

  if (hh >= 24 || mm >= 60) {
    throw Error("Invalid time format");
  }

  return hh * 60 + mm;
}

function convertToHHMM(minutes) {
  const format = (number) => (number < 10 ? `0${number}` : `${number}`);

  const hh = format(Math.floor(minutes / 60));
  const mm = format(minutes % 60);

  return `${hh}:${mm}`;
}

function convertTimesRanges(timesRanges, convertFunc) {
  return timesRanges.map(({ start, stop }) => ({
    start: convertFunc(start),
    stop: convertFunc(stop),
  }));
}

export { convertToMinutes, convertToHHMM, convertTimesRanges };
