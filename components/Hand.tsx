import { Card as CardType } from '../lib/types';

import Card from './Card';

type HandProps = {
  card1?: CardType;
  card2?: CardType;
};
const Hand = ({ card1, card2 }: HandProps) => {
  return (
    <div className='flex gap-6'>
      <Card card={card1} />
      <Card card={card2} />
    </div>
  );
};

export default Hand;
