export function formatEntityPrice(price: number): string {
  return `${price.toFixed(2)} €`;
}

export function getListingTagTone(tag?: string): 'selling_fast' | 'limited' | 'sold_out' | null {
  const normalized = tag?.trim().toUpperCase();
  if (normalized === 'SELLING FAST') return 'selling_fast';
  if (normalized === 'LIMITED') return 'limited';
  if (normalized === 'SOLD OUT') return 'sold_out';
  return null;
}

export function getAxisPlaceholder(axisId: string, label: string): string {
  switch (axisId) {
    case 'weekend':
      return 'Select days';
    case 'size':
      return 'Select size';
    case 'wave':
      return 'Select wave';
    case 'day':
      return 'Select day';
    case 'camping':
      return 'Select camping';
    case 'tent':
      return 'Select tent';
    case 'unit':
      return 'Select unit';
    case 'duration':
      return 'Select duration';
    case 'vehicle':
      return 'Select vehicle';
    case 'valid-day':
      return 'Select day';
    case 'option':
      return 'Select option';
    default:
      return `Select ${label.toLowerCase()}`;
  }
}

export function getEntityMetaLines(entity: {
  id: string;
  type: string;
  date?: string;
  description?: string;
  displaySummary?: boolean;
}): string[] {
  if (entity.type === 'composite') {
    const lines: string[] = [];
    if (entity.date) lines.push(entity.date);
    if (entity.description?.trim()) lines.push(entity.description.trim());
    return lines;
  }

  if (entity.id.startsWith('park-')) {
    return ['Festival entry ticket not included'];
  }

  if (entity.type === 'configurable_multi' && entity.displaySummary) {
    return ['Configure options in next step'];
  }

  if (entity.date) return [entity.date];
  return [];
}

export function getPreviewBullets(entity: {
  id: string;
  includedItems?: string[];
  cardPreviewBullets?: string[];
}): string[] {
  const isCamp = entity.id.startsWith('camp-');
  const isVip = entity.id === 'ticket-vip';
  const items = entity.includedItems ?? entity.cardPreviewBullets ?? [];
  if ((isCamp || isVip) && items.length > 0) {
    return items.slice(0, isVip ? 3 : 2);
  }
  return entity.cardPreviewBullets?.slice(0, 2) ?? [];
}

export function isTicketWaveLayout(entity: {
  id: string;
  type: string;
  variantAxes?: unknown[];
}): boolean {
  const compactCard =
    entity.id.startsWith('ticket-') ||
    entity.id.startsWith('park-') ||
    entity.id.startsWith('camp-');
  return entity.type === 'configurable_single' && !!entity.variantAxes?.length && compactCard;
}

export function showTitleListingTag(entity: { id: string; listingTag?: string }): boolean {
  if (entity.id.startsWith('ticket-')) return false;
  const category =
    entity.id.startsWith('camp-') || entity.id.startsWith('hotel-') || entity.id.startsWith('merch-');
  return category || !!entity.listingTag?.trim();
}
