export default function printTimesRanges({timesRanges, description}) {
  console.log(`${description}:`);

  for (const [index, { start, stop }] of timesRanges.entries()) {
    console.log(`${index + 1}. ${start} - ${stop}`);
  }

  console.log("\n")
}
