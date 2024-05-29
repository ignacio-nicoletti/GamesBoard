import Cards from '../cards/card';
import styles from './myCards.module.css';

const MyCards = ({ myPosition, players, setPlayers, setRound, round }) => {
  const player = players[myPosition - 1];

  return (
    <div className={styles.MyCardsContainer}>
      {player &&
        player.cardPerson &&
        player.cardPerson.map((card, index) => (
          <Cards
            key={index}
            value={card.value}
            suit={card.suit}
            players={players}
            setPlayers={setPlayers}
            setRound={setRound}
            round={round}
          
          />
        ))}

      {/* <div>
        {player &&
          player.cardBet.length > 0 &&
          player.cardBet.some(card => card.value !== null && card.suit !== "") &&
          player.cardBet.map((card, index) => (
            card.value !== null && card.suit !== "" && (
              <Cards
                key={index}
                value={card.value}
                suit={card.suit}
                players={players}
                setPlayers={setPlayers}
                setRound={setRound}
                round={round}
                myPosition={myPosition}
                roomId={round.roomId}
              />
            )
          ))}
      </div> */}
    </div>
  );
};

export default MyCards;
