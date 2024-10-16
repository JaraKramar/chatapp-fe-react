// @mui
import { enUS, csCZ } from '@mui/material/locale';

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
    label: 'English',
    value: 'en',
    systemValue: enUS,
    icon: '/assets/icons/flags/ic_flag_en.svg',
  },
  {
    label: 'Czech',
    value: 'cz',
    systemValue: csCZ,
    icon: '/assets/icons/flags/ic_flag_cz.svg',
  }
];

export const defaultLang = allLangs[0]; // English

// DEFAULT ROOT PATH
export const DEFAULT_PATH = PATH_DASHBOARD.general.app; // as '/app'

export const LOADING_MSG_STATUS = "LOADING_MSG_STATUS";
export const STRING_MODEL_CONNECTOR = " | "

// PATH FOR APP + AUTHENTICATION SETUP 

// DEV APP PATH
// directly api domain: https://uk1ibepo9i.execute-api.eu-central-1.amazonaws.com/development
export const api_domain = 'uk1ibepo9i.execute-api.eu-central-1.amazonaws.com/development';
export const api_domain_stage = '/development';

// PROD APP PATH
// export const api_domain = "mykaterag.dev3.rrz.aws.infra003.com"

// COGNITO SETUP
export const client_id = '4tehjk3k27fqu8tve52pdb10ib';
export const cognito_domain = 'rrz-dev-testing.auth.eu-central-1.amazoncognito.com';
export const JWKSDomain = 'cognito-idp.eu-central-1:.amazonaws.com';
export const userPoolId = 'eu-central-1_ghd5oT6yK';