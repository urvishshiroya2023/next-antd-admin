"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";

import { themeConfig } from "@/config/theme";
import { antdConfig } from "@/config/antd.config";
import { store } from "@/store/store";
import { Provider } from "react-redux";
import { AuthProvider } from "@/contexts/AuthContext";
import { I18nProvider } from "@/contexts/I18nContext";
import { RouteGuard } from "@/components/RouteGuard";
import { Navigation } from "@/components/Navigation";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AntdRegistry>
      <Provider store={store}>
        <ConfigProvider theme={themeConfig} {...antdConfig}>
          <I18nProvider>
            <AuthProvider>
              <RouteGuard>
                <Navigation>
                  {children}
                </Navigation>
              </RouteGuard>
            </AuthProvider>
          </I18nProvider>
        </ConfigProvider>
      </Provider>
    </AntdRegistry>
  );
}
