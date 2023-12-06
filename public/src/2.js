const DAY2 = 2;
parseData(DAY2, (input) => {
  const timeStringData = `Day ${DAY2}, Data Setup Execution Time`;
  console.time(timeStringData);
  const parsedInput = formatGames(input);
  console.timeEnd(timeStringData);

  const timeString1 = `Day ${DAY2}, Part 1 Execution Time`;
  console.time(timeString1);
  const validGames = Object.keys(parsedInput).map(id => isPossible(parsedInput[id], bagValues) && id).filter(Boolean);
  const part1 = getValidGameIdSum(validGames);
  console.timeEnd(timeString1);

  const timeString2 = `Day ${DAY2}, Part 2 Execution Time`;
  console.time(timeString2);
  const fewestCubes = Object.keys(parsedInput).map(id => fewestPossible(parsedInput[id]))
  const part2 = getSumOfPowers(fewestCubes);
  console.timeEnd(timeString2);

  showAnswers(DAY2, part1, part2);
});

const colors = ['red', 'blue', 'green'];

const formatGames = games => {
  return games.reduce((acc, curr) => {
    const [ , id, counts] = curr.split(/Game (\d+): /gi);
    acc[id] = counts.split('; ').map(count => formatCounts(count));
    return acc;
  }, {});
};

const formatCounts = count => {
  const regex = new RegExp(`(?<num>\\d+) (?<color>${colors.join('|')})`, 'gi');
  return [...count.matchAll(regex)].map(match => match.groups);
}

const bagValues = {
  red: 12,
  green: 13,
  blue: 14
};

const isPossible = (game, bag) => {
  let possible = true;
  for (let i=0; i<game.length; i++) {
    let set = game[i];
    for (let j=0; j<set.length; j++) {
      if (bag[set[j].color] < set[j].num) {
        possible = false;
        break;
      }
    }
  }
  return possible;
}

const getValidGameIdSum = ids => {
  return ids.reduce((acc, curr) => acc += parseInt(curr), 0)
};

const fewestPossible = game => {
  let minRed = 0,
      minGreen = 0,
      minBlue = 0;

  game.forEach(set => {
    set.forEach(pull => {
      let num = parseInt(pull.num);
      if (pull.color === 'red' && minRed < num) {
        minRed = num;
      } else if (pull.color === 'green' && minGreen < num) {
        minGreen = num;
      } else if (pull.color === 'blue' && minBlue < num) {
        minBlue = num;
      }
    });
  });

  return { minRed, minGreen, minBlue };
}

const getSumOfPowers = ids => {
  return ids.reduce((acc, curr) => acc += (curr.minRed * curr.minGreen * curr.minBlue), 0);
};
