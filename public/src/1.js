const DAY1 = 1;
parseData(DAY1, (input) => {
  const timeStringDay1 = `Day ${DAY1}, Total Execution Time`;
  console.time(timeStringDay1);

  const timeString1 = `Day ${DAY1}, Part 1 Execution Time`;
  console.time(timeString1);
  const part1 = getSum(formatLines(input, getNums));
  console.timeEnd(timeString1);

  const timeString2 = `Day ${DAY1}, Part 2 Execution Time`;
  console.time(timeString2);
  const part2 = getSum(formatLines(input, getFormattedNums));
  console.timeEnd(timeString2);

  console.timeEnd(timeStringDay1);
  showAnswers(DAY1, part1, part2);
});

const formatLines = (lines, callback) => {
  return lines.map(line => callback(line));
};

const getNums = line => {
  return line.match(/(\d)/g);
};

const getSum = lines => {
  return lines.reduce((acc, curr) => acc += getLineNum(curr), 0);
}

const getLineNum = line => {
  return parseInt(`${line[0]}${line[line.length - 1]}`);
};

const numberWords = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9
}

const getValidNumber = num => {
  return typeof num === 'number' && !isNaN(num);
};

const getFormattedNums = line => {
  const regex = new RegExp(`(?=(\\d|${Object.keys(numberWords).join('|')}))`, 'gi');
  const splitLine = [...line.matchAll(regex)].map(match => match[1]);
  return splitLine.map(element => (
    getValidNumber(parseInt(element)) && element) ||
    (numberWords[element] && numberWords[element].toString())
  );
}
