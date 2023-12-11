const DAY10 = 10;
parseData(DAY10, (input) => {
  const timeStringDay10 = `Day ${DAY10}, Total Execution Time`;
  console.time(timeStringDay10);

  const timeStringData1 = `Day ${DAY10}, Data Setup Execution Time`;
  console.time(timeStringData1);
  const map = createMap(input);
  const start = getStart(map);
  const loopDirection = findLoopDirection(map, start);
  const loop = buildLoop(map, start, loopDirection);
  console.timeEnd(timeStringData1);

  const timeString1 = `Day ${DAY10}, Part 1 Execution Time`;
  console.time(timeString1);
  const part1 = loop.length / 2;
  console.timeEnd(timeString1);

  const timeString2 = `Day ${DAY10}, Part 2 Execution Time`;
  console.time(timeString2);
  const part2 = getInteriorPoints(loop);
  console.timeEnd(timeString2);

  console.timeEnd(timeStringDay10);
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

const pipePossibilitiesByDirection = {
  north: ['|', '7', 'F'],
  south: ['|', 'L', 'J'],
  east: ['-', 'J', '7'],
  west: ['-', 'L', 'F']
};

const findLoopDirection = (map, { row, column }) => {
  const options = {
    north: { row: row - 1, column: column, possibilities: pipePossibilitiesByDirection.north },
    west: { row: row, column: column - 1, possibilities: pipePossibilitiesByDirection.west },
    east: { row: row, column: column + 1, possibilities: pipePossibilitiesByDirection.east },
    south: { row: row + 1, column: column, possibilities: pipePossibilitiesByDirection.south },
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
    loop.push({ row: currRow, column: currColumn, pipe, direction })

    switch (direction) {
      case 'north':
        currRow--;
        break;
      case 'west':
        currColumn--;
        break;
      case 'east':
        currColumn++;
        break;
      case 'south':
        currRow++;
        break;
    }
    pipe = map[currRow][currColumn];

    switch (pipe) {
      case 'L':
        if (direction === 'south') {
          direction = 'east';
        } else if (direction === 'west') {
          direction = 'north';
        }
        break;
      case 'J':
        if (direction === 'east') {
          direction = 'north';
        } else if (direction === 'south') {
          direction = 'west';
        }
        break;
      case '7':
        if (direction === 'east') {
          direction = 'south';
        } else if (direction === 'north') {
          direction = 'west';
        }
        break;
      case 'F':
        if (direction === 'north') {
          direction = 'east';
        } else if (direction === 'west') {
          direction = 'south';
        }
        break;
    }
  } while (pipe !== 'S');

  return loop;
}

/**
 * Combining Pick's Theorm and Shoelace Theorem to get Interior Points
 * https://11011110.github.io/blog/2021/04/17/picks-shoelaces.html
 *
 * Pick's Theorem:
 *    A = i + b/2 - 1
 *    where A is Area, i is points in interior, b is length of the points
 *
 * Shoelace Theorem:
 *    A = 1/2 Summation(x1 * y2 - y1 * x2)
 *
 * We can find the Area via the Shoelace Theorem,
 * then solve for i in Pick's Theorem to get the final point count:
 *    i = A - b/2 + 1 ==> i = 1/2 Summation(x1 * y2 - y1 * x2) - b/2 + 1
 */

// Pick's Theorem
const getInteriorPoints = loop => {
  return getArea(loop) - (loop.length) / 2 + 1;
};

// Shoelace Theorem
const getArea = loop => {
  return Math.abs(getSummation(loop)) / 2;
}

const getSummation = loop => {
  let sum = 0;
  for (let i=0; i<loop.length; i++) {
    if (i === loop.length - 1) {
      sum += multiplyPoints(loop[i], loop[0]);
    } else {
      sum += multiplyPoints(loop[i], loop[i+1]);
    }
  }
  return sum;
};

const multiplyPoints = (a, b) => {
  return a.column * b.row - a.row * b.column;
}

/* -------------------------------------------------------------------- */
/**
 * The following is another approach, but unfinished,
 * which would scrub all pipes not in the loop and replace with '.',
 * then determine what pipe is uner the starting position "S,"
 * and traverse the entire map (for each column in each row),
 * tracking when crossing over a character causes the points to "flip"
 * from "interior" to "exterior."
 *
 * More explanation can be found here:
 * https://www.youtube.com/watch?v=r3i3XE9H4uw
 *
 */

// const getAreaOfLoop = (map, loop) => {
//   let within = false;
//   let north = false;

//   return map.reduce((acc, row) => {
//     row.forEach(column => {
//       if (column === '|') {
//         within = !within;
//       } else if (column === '-') {

//       }
//     });
//     return acc;
//   }, []);
// };

const scrubNonLoopPipes = (map, loop) => {
  return map.map((row, rowIndex) => {
    return row.map((column, columnIndex) => {
      if (column === 'S') {
        return getStartPipe(loop);
      }
      return checkIfInLoop({ row: rowIndex, column: columnIndex}, loop)
        ? column
        : '.';
    });
  });
};

const checkIfInLoop = ({ row, column }, loop) => {
  let inLoop = false;
  for (let i=0; i<loop.length; i++) {
    if (row === loop[i].row && column === loop[i].column) {
      inLoop = true;
      break;
    }
  }
  return inLoop;
};

const invertDirection = direction => {
  switch (direction) {
    case 'north':
      return 'south';
    case 'south':
      return 'north';
    case 'east':
      return 'west';
    case 'west':
      return 'east';
  }
};

const getStartPipe = loop => {
  const start = invertDirection(loop[0].direction);
  const end = loop.slice(-1)[0].direction;

  return pipePossibilitiesByDirection[end].filter(
    pipe => pipePossibilitiesByDirection[start].includes(pipe)
  )[0];
}
