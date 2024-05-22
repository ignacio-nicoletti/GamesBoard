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

  
export const distribute=()=>{

    const baraja = [];
    for (let valor = 1; valor <= 12; valor++) {
      baraja.push({ valor: valor, palo: "basto" });
      baraja.push({ valor: valor, palo: "copa" });
      baraja.push({ valor: valor, palo: "espada" });
      baraja.push({ valor: valor, palo: "oro" });
    }
    return baraja
    }