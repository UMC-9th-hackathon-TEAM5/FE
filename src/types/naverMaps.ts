export type GeocodeStatus = "OK" | string;

export type GeocodeAddress = {
  roadAddress?: string;
  jibunAddress?: string;
  address?: string;
  x?: string;
  y?: string;
};

export type GeocodeResponse = {
  v2?: {
    addresses?: GeocodeAddress[];
  };
};

export type GeocodeOptions = {
  query: string;
  page?: number;
  count?: number;
};

export type NaverMapsApi = {
  Service: {
    geocode: (
      options: GeocodeOptions,
      callback: (status: GeocodeStatus, response: GeocodeResponse) => void,
    ) => void;
    Status: {
      OK: GeocodeStatus;
    };
  };
};

export type ReverseGeocodeResponse = {
  v2?: {
    results?: Array<{
      region?: {
        area1?: { name?: string };
        area2?: { name?: string };
      };
    }>;
  };
};

export type MapsApi = {
  LatLng: new (lat: number, lng: number) => unknown;
  Map: new (
    el: HTMLElement,
    options: {
      center: unknown;
      zoom: number;
      minZoom: number;
      scaleControl: boolean;
      mapDataControl: boolean;
      logoControlOptions: { position: unknown };
    },
  ) => {
    setCenter: (pos: unknown) => void;
  };
  Marker: new (options: {
    position: unknown;
    map: unknown;
    zIndex?: number;
    icon?: {
      content: string;
      anchor?: unknown;
    };
  }) => unknown;
  Point: new (x: number, y: number) => unknown;
  Position: {
    BOTTOM_LEFT: unknown;
  };
  Event: {
    addListener: (
      target: unknown,
      eventName: string,
      handler: () => void,
    ) => void;
  };
  Service: {
    reverseGeocode: (
      options: {
        coords: unknown;
        orders: string;
      },
      callback: (
        status: GeocodeStatus,
        response: ReverseGeocodeResponse,
      ) => void,
    ) => void;
    OrderType: {
      ADDR: string;
      ROAD_ADDR: string;
    };
    Status: {
      OK: GeocodeStatus;
    };
  };
};
