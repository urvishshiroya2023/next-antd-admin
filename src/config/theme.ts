import { appConfig } from "./app.config";

export const themeConfig = {
  token: {
    colorPrimary: appConfig.theme.primaryColor,
    colorError: appConfig.theme.secondaryColor,
  },
};
