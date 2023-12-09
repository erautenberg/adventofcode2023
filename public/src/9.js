const DAY9 = 9;
parseData(DAY9, (input) => {
  const timeStringData1 = `Day ${DAY9}, Part 1 Data Setup Execution Time`;
  console.time(timeStringData1);
  const oasis = formatNumsAsArrays(input);
  console.timeEnd(timeStringData1);

  const timeString1 = `Day ${DAY9}, Part 1 Execution Time`;
  console.time(timeString1);
  const part1 = getSumOfDifferences(oasis);
  console.timeEnd(timeString1);

  const timeString2 = `Day ${DAY9}, Part 2 Execution Time`;
  console.time(timeString2);
  const part2 = '';
  console.timeEnd(timeString2);

  showAnswers(DAY9, part1, part2);
});

const formatNumsAsArrays = input => {
  return input.map(line => line.split(' ').map(n => parseInt(n)));
};

const getDifferences = (nums, differences = [ nums ]) => {
  if (nums.every(n => n === 0)) {
    return differences;
  } else {
    differences.push([]);
    const index = differences.length - 1;
    for (i = 0; i<nums.length - 1; i++) {
      differences[index].push(nums[i + 1] - nums[i]);
    }
    return getDifferences(differences[index], differences);
  }
};

const getNextValue = (differences = []) => {
  let nextValue = 0;

  for (let i=differences.length - 1; i>0; i--) {
    const currLine = differences[i];
    currLine.push(nextValue);

    const currValue = currLine.slice(-1)[0];
    const prevValue = differences[i - 1].slice(-1)[0];
    nextValue = currValue + prevValue;
  }
  differences[0].push(nextValue);
  return nextValue;
};

const getSumOfDifferences = oasis => {
  return oasis.reduce((acc, curr) => acc += getNextValue(getDifferences(curr)), 0);
};
