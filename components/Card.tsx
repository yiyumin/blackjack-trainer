import { Card as CardType, Suit } from '../lib/types';

const SUIT_COLOR_MAP: Record<Suit, string> = {
  '♠': 'text-black',
  '♣': 'text-black',
  '♥': 'text-red-500',
  '♦': 'text-red-500',
};

type CardProps = {
  card?: CardType;
};

const Card = ({ card }: CardProps) => {
  return (
    <div
      className={`flex h-28 w-20 items-center justify-center rounded-md border-2 border-black dark:border-white ${
        card ? 'bg-slate-200' : 'bg-sky-600'
      }`}
    >
      {card && (
        <span className={`text-2xl ${SUIT_COLOR_MAP[card.suit]}`}>
          {card.rank} {card.suit}
        </span>
      )}
    </div>
  );
};

export default Card;
