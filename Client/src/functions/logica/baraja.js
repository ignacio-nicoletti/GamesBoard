// export const baraja = [
//     { valor: 1, palo: "basto" },
//     { valor: 2, palo: "basto" },
//     { valor: 3, palo: "basto" },
//     { valor: 4, palo: "basto" },
//     { valor: 5, palo: "basto" },
//     { valor: 6, palo: "basto" },
//     { valor: 7, palo: "basto" },
//     { valor: 8, palo: "basto" },
//     { valor: 9, palo: "basto" },
//     { valor: 10, palo: "basto" },
//     { valor: 11, palo: "basto" },
//     { valor: 12, palo: "basto" },
//     { valor: 1, palo: "oro" },
//     { valor: 2, palo: "oro" },
//     { valor: 3, palo: "oro" },
//     { valor: 4, palo: "oro" },
//     { valor: 5, palo: "oro" },
//     { valor: 6, palo: "oro" },
//     { valor: 7, palo: "oro" },
//     { valor: 8, palo: "oro" },
//     { valor: 9, palo: "oro" },
//     { valor: 10, palo: "oro" },
//     { valor: 11, palo: "oro" },
//     { valor: 12, palo: "oro" },
//     { valor: 1, palo: "espada" },
//     { valor: 2, palo: "espada" },
//     { valor: 3, palo: "espada" },
//     { valor: 4, palo: "espada" },
//     { valor: 5, palo: "espada" },
//     { valor: 6, palo: "espada" },
//     { valor: 7, palo: "espada" },
//     { valor: 8, palo: "espada" },
//     { valor: 9, palo: "espada" },
//     { valor: 10, palo: "espada" },
//     { valor: 11, palo: "espada" },
//     { valor: 12, palo: "espada" },
//     { valor: 1, palo: "copa" },
//     { valor: 2, palo: "copa" },
//     { valor: 3, palo: "copa" },
//     { valor: 4, palo: "copa" },
//     { valor: 5, palo: "copa" },
//     { valor: 6, palo: "copa" },
//     { valor: 7, palo: "copa" },
//     { valor: 8, palo: "copa" },
//     { valor: 9, palo: "copa" },
//     { valor: 10, palo: "copa" },
//     { valor: 11, palo: "copa" },
//     { valor: 12, palo: "copa" },

//   ];

export const barajar=()=>{


const baraja = [];
for (let valor = 1; valor <= 12; valor++) {
  baraja.push({ valor: valor, palo: "basto" });
  baraja.push({ valor: valor, palo: "copa" });
  baraja.push({ valor: valor, palo: "espada" });
  baraja.push({ valor: valor, palo: "oro" });
}
return baraja
}