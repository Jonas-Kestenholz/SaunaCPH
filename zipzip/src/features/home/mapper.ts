import type {
  GetHomeSlidesQueryResponse,
  GetMonthlyDropOverlayQueryResponse,
  HomeSlide,
  MetaobjectField,
  MonthlyDropOverlay,
} from './types';

function getField(fields: MetaobjectField[], key: string) {
  return fields.find((field) => field.key === key);
}

function getString(fields: MetaobjectField[], key: string): string {
  const field = getField(fields, key);
  return field?.value?.trim() ?? '';
}

function getBoolean(fields: MetaobjectField[], key: string): boolean {
  const value = getString(fields, key).toLowerCase();
  return value === 'true';
}

function getNumber(fields: MetaobjectField[], key: string): number {
  const value = Number(getString(fields, key));
  return Number.isNaN(value) ? 0 : value;
}

function getImage(fields: MetaobjectField[], key: string) {
  const field = getField(fields, key);
  const image = field?.reference?.image;

  if (!image?.url) {
    return null;
  }

  return {
    url: image.url,
    alt: image.altText ?? undefined,
  };
}

function isDefined<T>(value: T | null): value is T {
  return value !== null;
}

export function mapHomeSlides(response: GetHomeSlidesQueryResponse): HomeSlide[] {
  return response.metaobjects.edges
    .map<HomeSlide | null>(({ node }) => {
      const image = getImage(node.fields, 'image');

      if (!image) {
        return null;
      }

      const slide: HomeSlide = {
        id: node.id,
        handle: node.handle,
        title: getString(node.fields, 'title'),
        imageUrl: image.url,
        imageAlt: image.alt,
        ctaLabel: getString(node.fields, 'cta_label'),
        productHandle: getString(node.fields, 'product_handle'),
        sortOrder: getNumber(node.fields, 'sort_order'),
        active: getBoolean(node.fields, 'active'),
      };

      return slide;
    })
    .filter(isDefined)
    .filter((slide) => slide.active)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function mapMonthlyDropOverlay(
  response: GetMonthlyDropOverlayQueryResponse,
): MonthlyDropOverlay | null {
  const overlays = response.metaobjects.edges
    .map<MonthlyDropOverlay | null>(({ node }) => {
      const image = getImage(node.fields, 'image');

      if (!image) {
        return null;
      }

      const overlay: MonthlyDropOverlay = {
        id: node.id,
        handle: node.handle,
        title: getString(node.fields, 'title'),
        imageUrl: image.url,
        imageAlt: image.alt,
        dropDate: getString(node.fields, 'drop_date'),
        active: getBoolean(node.fields, 'active'),
        ctaLabel: getString(node.fields, 'cta_label') || undefined,
        productHandle: getString(node.fields, 'product_handle') || undefined,
      };

      return overlay;
    })
    .filter(isDefined);

  const activeEntry = overlays.find((overlay) => overlay.active);

  return activeEntry ?? null;
}