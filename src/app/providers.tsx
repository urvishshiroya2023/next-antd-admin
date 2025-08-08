"use client";

import { Navigation } from "@/components/Navigation";
import { RouteGuard } from "@/components/RouteGuard";
import { themeConfig } from "@/config/theme";
import { AuthProvider } from "@/contexts/AuthContext";
import { I18nProvider } from "@/contexts/I18nContext";
import { store } from "@/store/store";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import { Provider } from "react-redux";

// Create a wrapper component that uses the App context
function AntdAppWrapper({ children }: { children: React.ReactNode }) {
  return (

        <Navigation>
          {children}
        </Navigation>


  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AntdRegistry>
      <Provider store={store}>
        <ConfigProvider 
          theme={{
            ...themeConfig,
          
          
          }}

        >
          {/* <StyleProvider hashPriority="high"> */}
            <I18nProvider>
              <AuthProvider>
                <RouteGuard>
                  <AntdAppWrapper>
                    {children}
                  </AntdAppWrapper>
                </RouteGuard>
              </AuthProvider>
            </I18nProvider>
          {/* </StyleProvider> */}
        </ConfigProvider>
      </Provider>
    </AntdRegistry>
  );
}
