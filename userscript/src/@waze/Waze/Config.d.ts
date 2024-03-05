interface ShownByDefaultConfig {
  shownByDefault: boolean;
}
interface MinRankConfig {
  minRank: number;
}
interface EnableConfig {
  enable: boolean;
}
interface AllowEditingConfig {
  allowEditing: boolean;
}
interface PositionConfig {
  lon: number;
  lat: number;
  initialZoom: number;
}

export default interface Config {
  api_base: string;
  big_junctions: MinRankConfig | EnableConfig;
  cameras: EnableConfig;
  closures: EnableConfig;
  draggable: {
    minDragZoom: number;
  };
  houseNumbers:
    | AllowEditingConfig
    | ShownByDefaultConfig
    | {
        minEditZoom: number;
      };
  livemap: {
    max_zoom: number;
    url: string;
    zoom_offset: number;
  };
  login: {
    paths: {
      create: string;
      destroy: string;
      email_verification: string;
      get: string;
    };
  };
  map: {
    initialPosition: {
      il: PositionConfig;
      row: PositionConfig;
      usa: PositionConfig;
    };
    projection: {
      local: string;
      remote: string;
    };
  };
  openlayers: {
    img_path: string;
  };
  paths: {
    archive: string;
    archiveSessions: string;
    auth: string;
    cityExists: string;
    configurationInfo: string;
    elementHistory: string;
    features: string;
    houseNumbers: string;
    issues: string;
    issuesTrackerSearchList: string;
    issuesTrackerSearchMap: string;
    logger: string;
    mapCommentConversation: string;
    mapCommentFollow: string;
    mteDetails: string;
    mtePublish: string;
    mteReady: string;
    notifications: string;
    problemDetails: string;
    updateRequestComments: string;
    updateRequestFollow: string;
    updateRequestSessions: string;
    version: string;
  };
  place_updates: {
    focusZoom: number;
  };
  problems: {
    maxDetailsZoom: number;
    minDetailsZoom: number;
  };
  restrictions: AllowEditingConfig;
  search: {
    options: {
      origin: string;
    };
    resultZoom: number;
    server: string;
  };
  speed_limit: EnableConfig;
  tts: {
    default_locale: {
      tts: string;
      locale: string;
    };
    options: {
      content_type: string;
      lat: number;
      lon: number;
      protocol: number;
      sessionid: number;
      skipCache: boolean;
      type: string;
      validate_data: string; //? maybe restricted only to "positive" "negative"
      version: number;
    };
    url: string;
  };
  units: {
    lonLatPrecision: number;
  };
  user_drive: {
    arrowsMinDisplayZoom: number;
    gutterMinDisplayZoom: number;
    initialZoom: number;
    instructionsMinDisplayZoom: number;
    weightMinDisplayZoom: number;
  };
  user_editing_enabled: boolean;
  user_profile:
    | EnableConfig
    | {
        url: string;
      };
  venues: {
    categories: string[];
    image_bucket_url: string;
    subcategories: {
      [key: string]: string[];
    };
  };
}
