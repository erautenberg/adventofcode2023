const DAY7 = 7;
parseData(DAY7, (input) => {
  const timeStringData1 = `Day ${DAY7}, Part 1 Data Setup Execution Time`;
  console.time(timeStringData1);
  const hands = getHands(input);
  const sortedHands = compareHandsLowToHigh(hands);
  console.timeEnd(timeStringData1);

  // console.log(sortedHands);

  const timeString1 = `Day ${DAY7}, Part 1 Execution Time`;
  console.time(timeString1);
  const part1 = getScore(sortedHands);
  console.timeEnd(timeString1);

  const timeStringData2 = `Day ${DAY7}, Part 2 Data Setup Execution Time`;
  console.time(timeStringData2);
  const races2 = '';
  console.timeEnd(timeStringData2);

  const timeString2 = `Day ${DAY7}, Part 2 Execution Time`;
  console.time(timeString2);
  const part2 = '';
  console.timeEnd(timeString2);

  showAnswers(DAY7, part1, part2);
});

const cardNums = {
  'A': 14,
  'K': 13,
  'Q': 12,
  'J': 11,
  'T': 10,
  ...Array.from({length: 8}, (_, i) => i + 2).reduce((acc, curr) => (acc[curr] = parseInt(curr),acc), {})
};

const priority = new Map([
  ['5K', 0],
  ['4K', 1],
  ['FH', 2],
  ['3K', 3],
  ['2P', 4],
  ['1P', 5],
  ['HC', 6]
]);

const getHands = input => {
  return input.map(line => {
    const halves = line.split(' ');
    const bid = parseInt(halves[1]);
    const cardAsNums = convertCardsToNums(halves[0].split(''));
    const sortedCardsAsNums = cardAsNums.toSorted((a, b) => (a > b ? -1 : 1));
    const repeats = getNumberOfRepeats(cardAsNums);
    const handType = getHandType(repeats);
    return { cardAsNums, sortedCardsAsNums, repeats, handType, bid };
  });
};

const convertCardsToNums = cards => {
  return cards.map(card => cardNums[card]);
};

const getHandType = repeats => {
  let handType = 'HC';
  if (repeats[0][0] === 5) {
    handType = '5K';
  } else if (repeats[0][0] === 4) {
    handType = '4K';
  } else if (repeats[0][0] === 3 && repeats[1][0] === 2) {
    handType = 'FH';
  } else if (repeats[0][0] === 3 && repeats[1][0] === 1) {
    handType = '3K';
  } else if (repeats[0][0] === 2 && repeats[1][0] === 2) {
    handType = '2P';
  } else if (repeats[0][0] === 2) {
    handType = '1P';
  }
  return handType;
};

const getNumberOfRepeats = card => {
  const repeatsObj = card.reduce((acc, curr) => {
    acc[curr] ? ++acc[curr] : acc[curr] = 1;
    return acc;
  }, {});

  const repeatsArray = Object.keys(repeatsObj).map(key => [repeatsObj[key], parseInt(key)])

  return repeatsArray.sort((a, b) => {
    if (a[0] > b[0]) {
      return -1;
    } else if (a[0] < b[0]) {
      return 1;
    } else if (a[1] > b[1]) {
      return -1;
    } else if (a[1] < b[1]) {
      return 1;
    }
  });
};

const compareHandsLowToHigh = hands => {
  return hands.toSorted((a, b) => {
    if (priority.get(a.handType) < priority.get(b.handType)) {
      return 1;
    } else if (priority.get(a.handType) > priority.get(b.handType)) {
      return -1;
    } else if (priority.get(a.handType) === priority.get(b.handType)) {
        return recursiveComparison(a.cardAsNums, b.cardAsNums);
    }
    return 0;
  });
}

const recursiveComparison = (a, b) => {
  if (a.length > 0) {
    if (a[0] > b[0]) {
      return 1;
    } else if (a[0] < b[0]) {
      return -1;
    } else {
      return recursiveComparison(a.slice(1), b.slice(1));
    }
  }
  return 0;
}

const getScore = sortedHands => {
  return sortedHands.reduce((acc, curr, index) => (acc += curr.bid * (index + 1), acc), 0);
}
