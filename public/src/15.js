const DAY15 = 15;
parseData(DAY15, (input) => {
  const timeStringDay15 = `Day ${DAY15}, Total Execution Time`;
  console.time(timeStringDay15);

  const timeStringData1 = `Day ${DAY15}, Data Setup Execution Time`;
  console.time(timeStringData1);
  const sequence = splitStrings(input[0]);
  console.timeEnd(timeStringData1);

  const timeString1 = `Day ${DAY15}, Part 1 Execution Time`;
  console.time(timeString1);
  const part1 = getSumOfHASHes(sequence);
  console.timeEnd(timeString1);

  const timeString2 = `Day ${DAY15}, Part 2 Execution Time`;
  console.time(timeString2);
  const part2 = '';
  console.timeEnd(timeString2);

  console.timeEnd(timeStringDay15);
  showAnswers(DAY15, part1, part2);
});

const splitStrings = input => {
  return input.split(',').map(line => line.split(''));
};

const applyHashAlgorithm = instruction => {
  return instruction.reduce((acc, curr) => {
    acc += curr.charCodeAt();
    acc *= 17;
    acc %= 256;
    return acc;
  }, 0);
};

const getSumOfHASHes = sequence => {
  return sequence.reduce((acc, curr) => acc += applyHashAlgorithm(curr), 0);
}
