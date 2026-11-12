import { cards, dictionaryVersion } from './cards.js';
import { secureIndex } from './random.js';
export function drawOne(cryptoSource = globalThis.crypto) {
  const card = cards[secureIndex(cards.length, cryptoSource)];
  return Object.freeze({ cardId: card.id, drawnAt: new Date().toISOString(), dictionaryVersion });
}
export function lookupCard(id) {
  const card = cards.find(card => card.id === id);
  if (!card) throw new RangeError('없는 카드입니다.');
  return card;
}
