// @mui
import { enUS, csCZ } from "@mui/material/locale";

// routes
import { PATH_DASHBOARD } from "./routes/paths";

export const defaultSettings = {
  themeMode: "light",
  themeDirection: "ltr",
  themeContrast: "default",
  themeLayout: "horizontal",
  themeColorPresets: "default",
  themeStretch: false,
};

export const NAVBAR = {
  BASE_WIDTH: 260,
  DASHBOARD_WIDTH: 280,
  DASHBOARD_COLLAPSE_WIDTH: 88,
  //
  DASHBOARD_ITEM_ROOT_HEIGHT: 48,
  DASHBOARD_ITEM_SUB_HEIGHT: 40,
  DASHBOARD_ITEM_HORIZONTAL_HEIGHT: 32,
};

export const allLangs = [
  {
    label: "English",
    value: "en",
    systemValue: enUS,
    icon: "/assets/icons/flags/ic_flag_en.svg",
  },
  {
    label: "Czech",
    value: "cz",
    systemValue: csCZ,
    icon: "/assets/icons/flags/ic_flag_cz.svg",
  },
];

export const defaultLang = allLangs[0]; // English

// DEFAULT ROOT PATH
export const DEFAULT_PATH = PATH_DASHBOARD.general.app; // as '/app'

export const LOADING_MSG_STATUS = "LOADING_MSG_STATUS";
export const STRING_MODEL_CONNECTOR = " | ";

// PATH FOR APP + AUTHENTICATION SETUP

// DEV APP PATH
// directly api domain: https://uk1ibepo9i.execute-api.eu-central-1.amazonaws.com/development
// export const API_DOMAIN =
//   "uk1ibepo9i.execute-api.eu-central-1.amazonaws.com/development";
// export const API_DOMAIN_STAGE = "/development";
export const API_DOMAIN_STAGE = process.env.REACT_APP_DOMAIN_NAME ?? "";

export const API_DOMAIN_PREFIX = process.env.REACT_APP_API_DOMAIN_PREFIX ?? "mykaterag";
export const API_BASE_DOMAIN = process.env.REACT_APP_API_BASE_DOMAIN ?? "dev3.rrz.aws.infra003.com";
// PROD APP PATH
// export const API_DOMAIN = [API_DOMAIN_PREFIX, API_BASE_DOMAIN].join(".");
export const API_DOMAIN = API_BASE_DOMAIN;
// COGNITO SETUP
export const COGNITO_CLIENT_ID = process.env.REACT_APP_COGNITO_CLIENT_ID ?? "4tehjk3k27fqu8tve52pdb10ib";
export const COGNITO_DOMAIN = process.env.REACT_APP_COGNITO_DOMAIN ?? "rrz-dev-testing.auth.eu-central-1.amazoncognito.com";
export const JWKS_DOMAIN = process.env.REACT_APP_JWKS_DOMAIN ?? "cognito-idp.eu-central-1:.amazonaws.com";
export const USER_POOL_ID = process.env.REACT_APP_USER_POOL_ID ?? "eu-central-1_ghd5oT6yK";