const DAY4 = 4;
parseData(DAY4, (input) => {
  const formattedCards = formatCards(input);
  const part1 = getTotalScore(formattedCards);
  const part2 = getTotalCards(formattedCards);
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
