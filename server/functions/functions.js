export function shuffle(array) {
  let currentIndex = array.length;
  let temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

export const distribute = () => {
  const deck = [];
  for (let value = 1; value <= 12; value++) {
    deck.push({ value: value, suit: "basto" });
    deck.push({ value: value, suit: "copa" });
    deck.push({ value: value, suit: "espada" });
    deck.push({ value: value, suit: "oro" });
  }
  return deck;
};
