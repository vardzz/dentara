export type AvailabilitySlotMap = Record<string, string[]>;

const DAY_KEYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const DEFAULT_SLOTS = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

type DayKey = (typeof DAY_KEYS)[number];

type LegacyAvailability = Partial<Record<DayKey, boolean>>;
type MapAvailability = Partial<Record<DayKey, string[]>>;
type RichAvailability = {
  days?: Array<{
    day: DayKey;
    enabled?: boolean;
    slots?: string[];
  }>;
};

function isDayKey(value: string): value is DayKey {
  return DAY_KEYS.includes(value as DayKey);
}

function isValidSlot(value: string): boolean {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
}

function normalizeSlotList(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  const unique = new Set<string>();

  for (const item of input) {
    if (typeof item !== 'string') continue;
    const slot = item.trim();
    if (!isValidSlot(slot)) continue;
    unique.add(slot);
  }

  return Array.from(unique).sort();
}

function parseAvailabilityRaw(availabilityJson?: string | null): unknown {
  if (!availabilityJson) return null;

  try {
    return JSON.parse(availabilityJson) as unknown;
  } catch {
    return null;
  }
}

export function parseAvailabilityToSlotMap(availabilityJson?: string | null): AvailabilitySlotMap {
  const parsed = parseAvailabilityRaw(availabilityJson);
  const slotMap: AvailabilitySlotMap = {};

  for (const day of DAY_KEYS) {
    slotMap[day] = [];
  }

  if (!parsed || typeof parsed !== 'object') {
    return slotMap;
  }

  const maybeLegacy = parsed as LegacyAvailability;
  const maybeMap = parsed as MapAvailability;
  const maybeRich = parsed as RichAvailability;

  if (Array.isArray(maybeRich.days)) {
    for (const entry of maybeRich.days) {
      if (!entry || typeof entry !== 'object') continue;
      if (!isDayKey(entry.day)) continue;
      if (entry.enabled === false) {
        slotMap[entry.day] = [];
        continue;
      }

      const slots = normalizeSlotList(entry.slots);
      slotMap[entry.day] = slots.length ? slots : DEFAULT_SLOTS;
    }

    return slotMap;
  }

  for (const [key, value] of Object.entries(maybeMap)) {
    if (!isDayKey(key)) continue;

    if (Array.isArray(value)) {
      const slots = normalizeSlotList(value);
      slotMap[key] = slots.length ? slots : [];
      continue;
    }

    if (typeof maybeLegacy[key] === 'boolean') {
      slotMap[key] = maybeLegacy[key] ? [...DEFAULT_SLOTS] : [];
    }
  }

  return slotMap;
}

export function isSlotAvailableForDate(
  availabilityJson: string | null | undefined,
  scheduledAt: Date,
): boolean {
  const day = DAY_KEYS[scheduledAt.getDay()];
  const slot = `${String(scheduledAt.getHours()).padStart(2, '0')}:${String(scheduledAt.getMinutes()).padStart(2, '0')}`;
  const slotMap = parseAvailabilityToSlotMap(availabilityJson);

  return slotMap[day]?.includes(slot) ?? false;
}

export function getUpcomingAvailability(
  availabilityJson: string | null | undefined,
  daysToShow = 14,
): Array<{ date: string; day: DayKey; slots: string[] }> {
  const slotMap = parseAvailabilityToSlotMap(availabilityJson);
  const now = new Date();
  const items: Array<{ date: string; day: DayKey; slots: string[] }> = [];

  for (let i = 0; i < daysToShow; i += 1) {
    const date = new Date(now);
    date.setDate(now.getDate() + i);
    const day = DAY_KEYS[date.getDay()];
    const slots = slotMap[day] ?? [];

    if (!slots.length) continue;

    items.push({
      date: date.toISOString().split('T')[0],
      day,
      slots,
    });
  }

  return items;
}
