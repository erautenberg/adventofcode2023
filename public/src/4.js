const DAY4 = 4;
parseData(DAY4, (input) => {
  const timeStringDay4 = `Day ${DAY4}, Total Execution Time`;
  console.time(timeStringDay4);

  const timeStringData = `Day ${DAY4}, Data Setup Execution Time`;
  console.time(timeStringData);
  const formattedCards = formatCards(input);
  console.timeEnd(timeStringData);

  const timeString1 = `Day ${DAY4}, Part 1 Execution Time`;
  console.time(timeString1);
  const part1 = getTotalScore(formattedCards);
  console.timeEnd(timeString1);

  const timeString2 = `Day ${DAY4}, Part 2 Execution Time`;
  console.time(timeString2);
  const part2 = getTotalCards(formattedCards);
  console.timeEnd(timeString2);

  console.timeEnd(timeStringDay4);
  showAnswers(DAY4, part1, part2);
});

const formatCards = lines => {
  return lines.reduce((acc, curr) => {
    let [id, winning, player] = curr.split(/[Card|\:|\|]/).filter(Boolean);
    id = parseInt(id);
    winning = getNums(winning);
    player = getNums(player);
    acc.push([id, winning, player]);
    return acc;
  }, []);
};

const getNums = str => {
  return str.split(' ').filter(Boolean).map(n => parseInt(n));
};

const getMatchCount = card => {
  return card[1].reduce((acc, curr) => acc += card[2].includes(curr), 0);
};

const getScore = matches => {
  return matches > 0 ? 2 ** (matches - 1) : 0;
};

const getTotalScore = cards => {
  return cards.map(getMatchCount).reduce((acc, curr) => acc += getScore(curr), 0);
};

const getCardTotals = cards => {
  let cardCounts = Object.fromEntries(Array.from({ length: cards.length }, (_, i) => [i+1, 1]));
  cards.forEach(card => {
    cardId = card[0];
    for (i=0; i<cardCounts[cardId]; i++) {
      for (j=1; j<=getMatchCount(card); j++) {
        const cardIndex = cardId + j - 1;
        if (cards[cardIndex]) {
          const cardIndexToIncrease = cards[cardIndex][0];
          cardCounts[cardIndexToIncrease]++;
        }
      }
    }
  });
  return cardCounts;
};

const getTotalCards = cards => {
  const cardCounts = getCardTotals(cards);
  return Object.keys(cardCounts).reduce((acc, curr) => acc += cardCounts[curr], 0);
}
