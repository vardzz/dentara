const CASE_LABELS = [
  { label: 'Root Canal', terms: ['root canal', 'endodont', 'pulp'] },
  { label: 'Tooth Filling', terms: ['fill', 'restoration', 'restorative', 'operative', 'composite'] },
  { label: 'Tooth Replacement', terms: ['prosthodont', 'crown', 'bridge', 'denture', 'prosthetic', 'replacement'] },
  { label: 'Tooth Removal', terms: ['extract', 'removal', 'remove', 'impacted', 'wisdom', 'surgery'] },
  { label: 'Gum Care', terms: ['gum', 'periodont', 'clean', 'prophylaxis', 'hygiene'] },
] as const;

export const PLAIN_CASE_FILTERS = ['All', ...CASE_LABELS.map((item) => item.label)] as const;

export function toPlainCaseLabel(value: string): string {
  const normalized = value.trim().toLowerCase();

  for (const item of CASE_LABELS) {
    if (item.terms.some((term) => normalized.includes(term))) {
      return item.label;
    }
  }

  return value.trim();
}

export function matchesPlainCaseLabel(value: string, filter: string): boolean {
  if (filter === 'All') {
    return true;
  }

  return toPlainCaseLabel(value) === filter;
}