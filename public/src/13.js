const DAY13 = 13;
parseData(DAY13, (input) => {
  const timeStringDay13 = `Day ${DAY13}, Total Execution Time`;
  console.time(timeStringDay13);

  const timeStringData1 = `Day ${DAY13}, Data Setup Execution Time`;
  console.time(timeStringData1);
  const valley = splitPatterns(input);
  console.timeEnd(timeStringData1);

  const timeString1 = `Day ${DAY13}, Part 1 Execution Time`;
  console.time(timeString1);
  const part1 = getReflectionCounts(valley);
  console.timeEnd(timeString1);

  const timeString2 = `Day ${DAY13}, Part 2 Execution Time`;
  console.time(timeString2);
  const part2 = '';
  console.timeEnd(timeString2);

  console.timeEnd(timeStringDay13);
  showAnswers(DAY13, part1, part2);
});

const splitPatterns = input => {
  return input.reduce((acc, curr) => {
    if (curr === '') {
      acc.push([]);
    } else {
      acc[acc.length - 1].push(curr.split(''));
    }
    return acc;
  }, [[]]);
};

const findReflectionColumn = pattern => {
  let reflectionColumn;
  const line = pattern[0];
  for (let i=0; i<line.length; i++) {
    if (checkIfColumnReflects(line, i)) {
      let isValid = true;

      for (let k=1; k<pattern.length; k++) {
        if (!checkIfColumnReflects(pattern[k], i)) {
          isValid = false;
          break;
        }
      }
      if (isValid) {
        reflectionColumn = i;
        break;
      }
    }
  }
  return reflectionColumn;
}

const checkIfColumnReflects = (line, column) => {
  let left = column;
  let right = column + 1;
  let leftValue = line[left];
  let rightValue = line[right];
  let isValid = false;

  while (leftValue === rightValue) {
    left--;
    right++;
    leftValue = line[left];
    rightValue = line[right];
    if (!leftValue || !rightValue) {
      isValid = true;
      break;
    }
  }

  return isValid;
};

const getReflectionCounts = valley => {
  return valley.reduce((acc, curr) => {
    let reflection = findReflectionColumn(curr);
    if (reflection === undefined) {
      reflection = (findReflectionColumn(transpose(curr), true) + 1) * 100;
    } else {
      reflection++;
    }
    acc += reflection;
    return acc;
  }, 0);
}
