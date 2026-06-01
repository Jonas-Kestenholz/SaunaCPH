export type HomeSlide = {
  id: string;
  handle: string;
  title: string;
  imageUrl: string;
  imageAlt?: string;
  ctaLabel: string;
  productHandle: string;
  sortOrder: number;
  active: boolean;
};

export type MetaobjectField = {
  key: string;
  value: string | null;
  reference?: {
    image?: {
      url: string;
      altText: string | null;
    } | null;
  } | null;
};

export type GetHomeSlidesQueryResponse = {
  metaobjects: {
    edges: Array<{
      node: {
        id: string;
        handle: string;
        type: string;
        fields: MetaobjectField[];
      };
    }>;
  };
};
export type MonthlyDropOverlay = {
  id: string;
  handle: string;
  title: string;
  imageUrl: string;
  imageAlt?: string;
  dropDate: string;
  active: boolean;
  activationDaysBefore: number;
  ctaLabel?: string;
  productHandle?: string;
};

export type GetMonthlyDropOverlayQueryResponse = {
  metaobjects: {
    edges: Array<{
      node: {
        id: string;
        handle: string;
        type: string;
        fields: MetaobjectField[];
      };
    }>;
  };
};

export type HomeContent = {
  slides: HomeSlide[];
  overlay: MonthlyDropOverlay | null;
  isDropMode: boolean;
};