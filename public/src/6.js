const DAY6 = 6;
parseData(DAY6, (input) => {
  const timeStringData = `Day ${DAY6}, Data Setup Execution Time`;
  console.time(timeStringData);
  const races = getRaceData(input);
  console.timeEnd(timeStringData);

  const timeString1 = `Day ${DAY6}, Part 1 Execution Time`;
  console.time(timeString1);
  const part1 = getProductOfWaysToWin(races);
  console.timeEnd(timeString1);

  const timeString2 = `Day ${DAY6}, Part 2 Execution Time`;
  console.time(timeString2);
  const part2 = '';
  console.timeEnd(timeString2);

  showAnswers(DAY6, part1, part2);
});

const getRaceData = input => {
  return {
    times: parseValues(input[0]),
    distances: parseValues(input[1]),
  }
};

const parseValues = input => {
  return input.split(/\s+|:\s*/gi).map(n => parseInt(n)).filter(Boolean);
};

const getDistance = (totalTime, buttonTime) => {
  let distance = 0;
  if (totalTime > buttonTime) {
    const travelTime = totalTime - buttonTime;
    distance = buttonTime * travelTime;
  }

  return distance;
};

const getTimes = (time, distance) => {
  return [...Array(time).keys()].reduce((acc, curr) => {
    if (getDistance(time, curr) > distance) {
      acc.push(curr);
    }
    return acc;
  }, []);
};

const getWaysToWin = (time, distance) => {
  return getTimes(time, distance).length;
};

const getWaysToWinArray = races => {
  return races.times.map((time, index) => getWaysToWin(time, races.distances[index]));
};

const getProductOfWaysToWin = races => {
  return getWaysToWinArray(races).reduce((acc, curr) => acc *= curr, 1);
}
