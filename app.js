import { cards } from './cards.js';
import { drawOne, lookupCard } from './reading.js';
const $ = id => document.getElementById(id);
function el(tag, text, className) { const e = document.createElement(tag); e.textContent = text; if (className) e.className = className; return e; }
function meaningContent(card) {
  const fragment = document.createDocumentFragment();
  const tags = el('div', '', 'tags'); card.keywords.forEach(k => tags.append(el('span', k))); fragment.append(tags, el('p', card.meaning));
  fragment.append(el('h3', '생각해 볼 질문 · 사이트 작성'), el('p', card.prompt, 'prompt'));
  return fragment;
}
$('draw').addEventListener('click', () => {
  const button = $('draw'); button.disabled = true;
  try {
    const record = drawOne(); const card = lookupCard(record.cardId);
    $('card-number').textContent = 'NO. ' + String(card.id).padStart(2, '0');
    $('card-symbol').textContent = card.symbol; $('card-name').textContent = card.name; $('card-english').textContent = card.english.toUpperCase();
    $('card-face').classList.add('revealed'); $('card-caption').textContent = '36장 중 한 장 · 정방향';
    $('result-title').textContent = card.id + '. ' + card.name;
    $('result-body').replaceChildren();
    const question = $('question').value.trim(); if (question) $('result-body').append(el('p', '나의 질문: ' + question, 'question-echo'));
    $('result-body').append(meaningContent(card));
    const audit = el('details', ''); audit.append(el('summary', '추첨 정보 보기'));
    audit.append(el('p', '카드 ID: ' + record.cardId + ' · 사전 v' + record.dictionaryVersion), el('p', '추첨 시각: ' + record.drawnAt), el('p', 'Web Crypto · 32비트 거절 추출 · 1/36', 'small'));
    $('result-body').append(audit); button.replaceChildren(document.createTextNode('다시 한 장 뽑기 '), el('span', '↗'));
  } catch (error) { $('result-title').textContent = '추첨을 완료하지 못했어요.'; $('result-body').replaceChildren(el('p', error.message)); }
  finally { button.disabled = false; }
});
function renderLibrary() {
  const query = $('search').value.trim().toLowerCase();
  const visible = cards.filter(c => [String(c.id), c.name, c.english, ...c.keywords].some(t => t.toLowerCase().includes(query)));
  $('library').replaceChildren(); $('empty').hidden = visible.length > 0;
  for (const card of visible) {
    const button = el('button', '', 'library-card'); button.type = 'button'; button.setAttribute('aria-label', card.id + '번 ' + card.name + ' 의미 보기');
    button.append(el('span', String(card.id).padStart(2, '0'), 'library-number'), el('span', card.symbol, 'library-symbol'), el('strong', card.name), el('span', card.english, 'library-english'));
    button.addEventListener('click', () => { const detail = $('dictionary-detail'); detail.hidden = false; detail.replaceChildren(el('p', '사전 열람 · 추첨 결과와 별개', 'eyebrow'), el('h3', card.id + '. ' + card.name), meaningContent(card)); detail.focus({preventScroll:true}); detail.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block:'nearest'}); });
    $('library').append(button);
  }
}
$('search').addEventListener('input', renderLibrary); renderLibrary();
