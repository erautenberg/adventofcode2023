const DAY6 = 6;
parseData(DAY6, (input) => {
  const timeStringData1 = `Day ${DAY6}, Part 1 Data Setup Execution Time`;
  console.time(timeStringData1);
  const races1 = getRaceData(input);
  console.timeEnd(timeStringData1);

  const timeString1 = `Day ${DAY6}, Part 1 Execution Time`;
  console.time(timeString1);
  const part1 = getProductOfWaysToWin(races1);
  console.timeEnd(timeString1);

  const timeStringData2 = `Day ${DAY6}, Part 2 Data Setup Execution Time`;
  console.time(timeStringData2);
  const races2 = getRaceData(input, true);
  console.timeEnd(timeStringData2);

  const timeString2 = `Day ${DAY6}, Part 2 Execution Time`;
  console.time(timeString2);
  const part2 = getProductOfWaysToWin(races2);
  console.timeEnd(timeString2);

  showAnswers(DAY6, part1, part2);
});

const getRaceData = (input, combine) => {
  return {
    times: parseValues(input[0], combine),
    distances: parseValues(input[1], combine),
  }
};

const parseValues = (input, combine) => {
  let numsAsStrings = input.split(/\s+|:\s*/gi).slice(1);
  if (combine) {
    numsAsStrings = [numsAsStrings.join('')];
  }
  return numsAsStrings.map(n => parseInt(n)).filter(Boolean);
};

const getDistance = (totalTime, buttonTime) => {
  let distance = 0;
  if (totalTime > buttonTime) {
    const travelTime = totalTime - buttonTime;
    distance = buttonTime * travelTime;
  }

  return distance;
};

const getWaysToWin = (time, distance) => {
  for (let i=0; i<time; i++) {
    if (getDistance(time, i) > distance) {
      return time - i * 2 + 1;
    }
  }
  return 0;
};

const getWaysToWinArray = races => {
  return races.times.map((time, index) => getWaysToWin(time, races.distances[index]));
};

const getProductOfWaysToWin = races => {
  return getWaysToWinArray(races).reduce((acc, curr) => acc *= curr, 1);
}

const getTimesOptimized = (time, distance) => {
  let start;
  for (let i=0; i<time; i++) {
    if (getDistance(time, i) > distance) {
      start = i;
      break;
    }
  }
  if (start !== undefined) {
    let end = time - start;
  }

  return start !== undefined ? time - start + 1 : 0;

  // // Math.ceil(time / 2)
  // return [...Array(time).keys()].reduce((acc, curr) => {
  //   if (getDistance(time, curr) > distance) {
  //     acc.push(curr);
  //   }
  //   return acc;
  // }, []);
};
