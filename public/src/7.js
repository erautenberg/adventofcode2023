const DAY7 = 7;
parseData(DAY7, (input) => {
  const timeStringData1 = `Day ${DAY7}, Part 1 Data Setup Execution Time`;
  console.time(timeStringData1);
  const hands = getHands(input);
  console.timeEnd(timeStringData1);

  const timeString1 = `Day ${DAY7}, Part 1 Execution Time`;
  console.time(timeString1);
  const sortedHands = compareHandsLowToHigh(hands);
  const part1 = getScore(sortedHands);
  console.timeEnd(timeString1);

  const timeString2 = `Day ${DAY7}, Part 2 Execution Time`;
  console.time(timeString2);
  const sortedHandsWithJAsJokers = compareHandsLowToHighWithJAsJokers(hands);
  console.log(sortedHandsWithJAsJokers)
  const part2 = getScore(sortedHandsWithJAsJokers);
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

const cardNumsWithJAsJokers = {
  ...cardNums,
  J: 1
}

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

    const cardAsNumsWithJAsJokers = convertCardsToNums(halves[0].split(''), true);
    const repeatsWithJAsJokers = getNumberOfRepeats(cardAsNums, true);
    const jokerCount = cardAsNums.filter(c => c === 11).length;
    const handTypeWithJAsJokers = getHandTypeWithJAsJokers(repeatsWithJAsJokers, jokerCount);

    return {
      cards: halves[0],
      cardAsNums,
      sortedCardsAsNums,
      repeats,
      handType,
      cardAsNumsWithJAsJokers,
      repeatsWithJAsJokers,
      jokerCount,
      handTypeWithJAsJokers,
      bid
    };
  });
};

const convertCardsToNums = (cards, jokers = false) => {
  return cards.map(card => jokers ? cardNumsWithJAsJokers[card] : cardNums[card]);
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

const getHandTypeWithJAsJokers = (repeats, jokers) => {
  if (!jokers) {
    return getHandType(repeats);
  }

  let handType = 'HC';

  if (jokers >= 4) {
    handType = '5K';
  } else if (jokers === 3) {
    if (repeats[0][0] === 2) {
      handType = '5K';
    } else {
      handType = '4K';
    }
  } else if (jokers === 2) {
    if (repeats[0][0] === 3) {
      handType = '5K';
    } else if (repeats[0][0] === 2) {
      handType = '4K'
    } else {
      handType = '3K';
    }
  } else if (jokers === 1) {
    if (repeats[0][0] === 4) {
      handType = '5K';
    } else if (repeats[0][0] === 3) {
      handType = '4K'
    } else if (repeats[0][0] === 2 && repeats[1][0] === 2) {
      handType = 'FH';
    } else if (repeats[0][0] === 2) {
      handType = '3K';
    } else {
      handType = '1P';
    }
  }

  return handType;
}

const getNumberOfRepeats = (card, jokers = false) => {
  const repeatsObj = card.reduce((acc, curr) => {
    if (!(jokers && curr === cardNums['J'])) {
      acc[curr] ? ++acc[curr] : acc[curr] = 1;
    }
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

const compareHandsLowToHighWithJAsJokers = hands => {
  return hands.toSorted((a, b) => {
    if (priority.get(a.handTypeWithJAsJokers) < priority.get(b.handTypeWithJAsJokers)) {
      return 1;
    } else if (priority.get(a.handTypeWithJAsJokers) > priority.get(b.handTypeWithJAsJokers)) {
      return -1;
    } else if (priority.get(a.handTypeWithJAsJokers) === priority.get(b.handTypeWithJAsJokers)) {
      return recursiveComparison(a.cardAsNumsWithJAsJokers, b.cardAsNumsWithJAsJokers);
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
