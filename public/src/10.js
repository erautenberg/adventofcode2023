const DAY10 = 10;
parseData(DAY10, (input) => {
  const timeStringData1 = `Day ${DAY10}, Part 1 Data Setup Execution Time`;
  console.time(timeStringData1);
  const map = createMap(input);
  const start = getStart(map);
  console.timeEnd(timeStringData1);

  const timeString1 = `Day ${DAY10}, Part 1 Execution Time`;
  console.time(timeString1);
  const loopDirection = findLoopDirection(map, start);
  const loop = buildLoop(map, start, loopDirection);
  const part1 = loop.length / 2;
  console.timeEnd(timeString1);

  const timeString2 = `Day ${DAY10}, Part 2 Execution Time`;
  console.time(timeString2);
  const part2 = '';
  console.timeEnd(timeString2);

  showAnswers(DAY10, part1, part2);
});

const createMap = input => {
  return input.map(line => line.split(''));
};

const getStart = map => {
  let column, row;
  for (let i=0; i<map.length; i++) {
    for (let j=0; j<map[i].length; j++) {
      if (map[i][j] === 'S') {
        row = i;
        column = j;
        break;
      }
    }
  }
  return { column, row }
};

const findLoopDirection = (map, { row, column }) => {
  const options = {
    up: { row: row - 1, column: column, possibilities: ['|', '7', 'F'] },
    left: { row: row, column: column - 1, possibilities: ['-', 'L', 'F'] },
    right: { row: row, column: column + 1, possibilities: ['-', 'J', '7'] },
    down: { row: row + 1, column: column, possibilities: ['|', 'L', 'J'] },
  };

  const keys = Object.keys(options);
  for (let i=0; i<keys.length; i++) {
    const direction = options[keys[i]];
    const value = map[direction.row]?.[direction.column];
    if (value && direction.possibilities.includes(value)) {
      return keys[i];
    }
  }

  return;
};

const buildLoop = (map, { row, column }, startingDirection) => {
  let currRow = row;
  let currColumn = column;
  let direction = startingDirection;

  let pipe = map[currRow][currColumn];
  let loop = [];

  do {
    loop.push({ row: currRow, column: currColumn, pipe })

    switch (direction) {
      case 'up':
        currRow--;
        break;
      case 'left':
        currColumn--;
        break;
      case 'right':
        currColumn++;
        break;
      case 'down':
        currRow++;
        break;
    }
    pipe = map[currRow][currColumn];

    switch (pipe) {
      case 'L':
        if (direction === 'down') {
          direction = 'right';
        } else if (direction === 'left') {
          direction = 'up';
        }
        break;
      case 'J':
        if (direction === 'right') {
          direction = 'up';
        } else if (direction === 'down') {
          direction = 'left';
        }
        break;
      case '7':
        if (direction === 'right') {
          direction = 'down';
        } else if (direction === 'up') {
          direction = 'left';
        }
        break;
      case 'F':
        if (direction === 'up') {
          direction = 'right';
        } else if (direction === 'left') {
          direction = 'down';
        }
        break;
    }
  } while (pipe !== 'S');

  return loop;
}
