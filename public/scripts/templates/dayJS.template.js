module.exports = num => {
  return `const DAY${num} = ${num};
parseData(DAY${num}, (input) => {
  const timeStringData1 = \`Day \$\{DAY${num}\}, Part 1 Data Setup Execution Time\`;
  console.time(timeStringData1);

  console.timeEnd(timeStringData1);

  const timeString1 = \`Day \$\{DAY${num}\}, Part 1 Execution Time\`;
  console.time(timeString1);
  const part1 = '';
  console.timeEnd(timeString1);

  const timeString2 = \`Day \$\{DAY${num}\}, Part 2 Execution Time\`;
  console.time(timeString2);
  const part2 = '';
  console.timeEnd(timeString2);

  showAnswers(DAY9, part1, part2);
});`;
};

