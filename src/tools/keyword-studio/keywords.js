/**
 * Core research-derived keyword groups are based on six user-provided competitor reports.
 * 'High' is a relevance / prioritization signal, NOT evidence of sales or conversion.
 * Terms like camera ring and tempered glass should only be used for matching products.
 */
export const CORE_TEMPLATES = [
  ['high', '{phone} camera lens protector', 'Protector intent'],
  ['high', '{phone} camera lens', 'Broad discovery'],
  ['high', '{phone} lens protector', 'Protector intent'],
  ['high', '{phone} back camera lens', 'Back camera'],
  ['high', 'camera lens protector for {phone}', 'Reverse wording'],
  ['high', 'lens protector for {phone}', 'Reverse wording'],
  ['medium', '{phone} camera glass', 'Glass wording'],
  ['medium', '{phone} camera protector', 'Protector intent'],
  ['medium', '{phone} lens', 'Broad discovery'],
  ['medium', '{phone} back camera protector', 'Back camera'],
  ['medium', '{phone} camera lens glass', 'Glass wording'],
  ['medium', '{phone} camera lens guard', 'Guard wording'],
  ['medium', '{phone} camera glass protector', 'Glass wording'],
  ['medium', '{phone} camera lens cover', 'Cover wording'],
  ['test', '{phone} rear camera protector', 'Rear camera'],
  ['test', '{phone} camera protection glass', 'Glass wording'],
  ['test', '{phone} lens glass', 'Glass wording'],
  ['test', '{phone} camera lens outer', 'Outer lens'],
];

export const RING_TEMPLATES = [
  ['high', '{phone} camera ring', 'Ring style'],
  ['high', 'camera ring {phone}', 'Ring style'],
  ['test', '{phone} camera ring protector', 'Ring style'],
];

export const GLASS_TEMPLATES = [
  ['test', '{phone} camera lens tempered glass', 'Glass protector'],
];

export const COLOR_TEMPLATES = [
  ['medium', '{phone} {color} camera lens protector', 'Colour specific'],
  ['medium', '{phone} camera lens protector {color}', 'Colour specific'],
  ['medium', '{phone} {color} lens protector', 'Colour specific'],
  ['medium', '{phone} camera glass {color}', 'Colour specific'],
  ['test', '{color} camera lens protector for {phone}', 'Colour specific'],
  ['test', '{phone} {color} back camera protector', 'Colour specific'],
];

export const COLOR_RING_TEMPLATES = [
  ['medium', '{phone} {color} camera ring', 'Colour ring'],
  ['medium', '{phone} camera ring {color}', 'Colour ring'],
];

export const DEFAULT_SETTINGS = {
  brand: 'iPhone', model: '17 Pro', color: 'Black',
  useColor: true, ringStyle: true, glassStyle: false,
};

/** Keyword output is a pure function so it is easy to test and reuse in future bulk tools. */
export function generateKeywords(settings) {
  const brand = String(settings.brand || '').trim().replace(/\s+/g, ' ');
  const model = String(settings.model || '').trim().replace(/\s+/g, ' ');
  const color = String(settings.color || '').trim().replace(/\s+/g, ' ');
  if (!brand || !model) return [];
  const phone = `${brand} ${model}`;
  const templates = [
    ...CORE_TEMPLATES,
    ...(settings.ringStyle ? RING_TEMPLATES : []),
    ...(settings.glassStyle ? GLASS_TEMPLATES : []),
    ...(settings.useColor && color ? COLOR_TEMPLATES : []),
    ...(settings.useColor && color && settings.ringStyle ? COLOR_RING_TEMPLATES : []),
  ];
  const unique = new Set();
  return templates.map(([priority, template, intent]) => {
    const keyword = template.replaceAll('{phone}', phone).replaceAll('{color}', color);
    return { id: `${priority}:${keyword.toLowerCase()}`, keyword, priority, intent, type: template.includes('{color}') ? 'Colour' : 'Core' };
  }).filter(row => {
    const key = row.keyword.toLocaleLowerCase('en');
    if (unique.has(key)) return false;
    unique.add(key);
    return true;
  });
}

export function keywordColonList(rows) {
  return rows
    .map(row => String(row.keyword ?? '').trim())
    .filter(Boolean)
    .join('::');
}

export function keywordCsv(rows) {
  const escape = value => `"${String(value).replaceAll('"', '""')}"`;
  const data = [['Keyword', 'Priority', 'Intent', 'Type'], ...rows.map(r => [r.keyword, r.priority, r.intent, r.type])];
  return '\ufeff' + data.map(row => row.map(escape).join(',')).join('\r\n');
}

export function downloadCsv(rows, filename = 'sellerkit-keywords.csv') {
  const blob = new Blob([keywordCsv(rows)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
