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
  const part2 = getReflectionCountsWithSmudge(valley);
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

const findReflectionColumn = (pattern, line) => {
  let reflectionColumn;
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
};

const findAllReflectionColumns = (pattern, line) => {
  let reflectionColumns = [];
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
        reflectionColumns.push(i);
      }
    }
  }
  return reflectionColumns;
};

const getReflection = (pattern) => {
  let reflection = findReflectionColumn(pattern, pattern[0]);
  if (reflection === undefined) {
    const transposedCurr = transpose(pattern);
    reflection = (findReflectionColumn(transposedCurr, transposedCurr[0]) + 1) * 100;
  } else {
    reflection++;
  }
  return reflection;
};

const getReflectionTotal = reflections => {
  return reflections.reduce((acc, curr) => acc += curr, 0);
};

const getReflectionCounts = valley => {
  return getReflectionTotal(
    valley.reduce((acc, curr) => {
      acc.push(getReflection(curr));
      return acc;
    }, [])
  );
};

const flipSymbol = symbol => {
  return symbol === '.' ? '#' : '.';
};

const getAllReflections = pattern => {
  let reflections = findAllReflectionColumns(pattern, pattern[0]).map(n => ++n);
  const transposedCurr = transpose(pattern);
  reflections.push(
    ...findAllReflectionColumns(transposedCurr, transposedCurr[0]).map(n => (n + 1) * 100)
  );
  return reflections;
};

const getReflectionCountsWithSmudge = (valley) => {
  let allReflections = [];

  for (let i=0; i<valley.length; i++) {
    const pattern = valley[i];

    patternLoop: for (let j=0; j<pattern.length; j++) {
      const line = pattern[j];
      const allPatternReflections = getAllReflections(pattern);

      for (let k=0; k<line.length; k++) {
        let newLine = [line.slice(0, k), flipSymbol(line[k]), line.slice(k + 1)].flat();
        let newPattern = [
          pattern.slice(0, j),
          [ newLine ],
          pattern.slice(j + 1)
        ].flat();

        const newReflections = getAllReflections(newPattern).filter(
          summary => !allPatternReflections.includes(summary)
        );
        if (newReflections.length === 1) {
          allReflections.push(newReflections[0]);
          break patternLoop;
        }
      }
    }
  }

  return getReflectionTotal(allReflections);
};
