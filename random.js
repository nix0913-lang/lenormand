// 이 모듈은 질문, 의미 사전, UI를 전혀 알지 못합니다.
const RANGE = 2 ** 32;
export function secureIndex(size, cryptoSource = globalThis.crypto) {
  if (!Number.isInteger(size) || size < 1 || size > RANGE) throw new RangeError('잘못된 카드 수입니다.');
  if (!cryptoSource || typeof cryptoSource.getRandomValues !== 'function') throw new Error('이 브라우저는 안전한 난수 추첨을 지원하지 않습니다. 최신 브라우저로 열어 주세요.');
  const limit = Math.floor(RANGE / size) * size;
  const buffer = new Uint32Array(1);
  // 단순 나머지 계산의 편향을 없애기 위해 끝부분을 버리고 다시 받습니다.
  do { cryptoSource.getRandomValues(buffer); } while (buffer[0] >= limit);
  return buffer[0] % size;
}
