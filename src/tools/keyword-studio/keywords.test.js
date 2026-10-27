import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeywords, keywordColonList, keywordCsv, DEFAULT_SETTINGS } from './keywords.js';

test('generates model-specific camera lens keywords', () => {
  const rows = generateKeywords(DEFAULT_SETTINGS);
  assert(rows.length >= 25);
  assert(rows.some(row => row.keyword === 'iPhone 17 Pro camera lens protector'));
  assert(rows.some(row => row.keyword === 'iPhone 17 Pro Black camera ring'));
  assert(rows.every(row => row.keyword.includes('iPhone 17 Pro')));
});

test('does not include colour or ring terms when disabled', () => {
  const rows = generateKeywords({ ...DEFAULT_SETTINGS, ringStyle: false, useColor: false });
  assert(!rows.some(row => row.keyword.toLowerCase().includes('ring')));
  assert(!rows.some(row => row.keyword.includes('Black')));
});

test('blank model does not generate misleading generic keywords', () => {
  assert.deepEqual(generateKeywords({ ...DEFAULT_SETTINGS, model: ' ' }), []);
});

test('all generated keywords are unique, ignoring case', () => {
  const rows = generateKeywords(DEFAULT_SETTINGS);
  assert.equal(rows.length, new Set(rows.map(row => row.keyword.toLowerCase())).size);
});

test('colon-separated copy format joins selected keywords with double-colon separators', () => {
  const data = keywordColonList([
    { keyword: 'Galaxy S24 Ultra lens protector' },
    { keyword: 'camera glass guard' },
    { keyword: 'tempered glass lens cover' },
    { keyword: 'anti-scratch camera film' },
    { keyword: 'S24 Ultra camera protector' },
  ]);

  assert.equal(
    data,
    'Galaxy S24 Ultra lens protector::camera glass guard::tempered glass lens cover::anti-scratch camera film::S24 Ultra camera protector'
  );
});

test('CSV safely escapes quotes', () => {
  const data = keywordCsv([{keyword:'Lens "A"', priority:'high', intent:'Test', type:'Core'}]);
  assert(data.includes('"Lens ""A"""'));
});
