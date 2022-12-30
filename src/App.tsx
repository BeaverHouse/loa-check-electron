import { ConfigProvider, Layout, theme, App as AntdApp } from 'antd';
import { useContext } from 'react';
import MainPage from './components/pages/MainPage';
import { LoaContext } from './contexts';
import { BLUE_TONE, DARK_PRIMARY } from './func/constant';
function App() {

  const { defaultAlgorithm, darkAlgorithm } = theme;
  const { isDark } = useContext(LoaContext)

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? darkAlgorithm : defaultAlgorithm,
        token: isDark ? {
          colorBgLayout: "#2c3e50",
          colorBgElevated: "#2c3e50",
          colorBgContainer: "#2c3e50",
          colorBorder: BLUE_TONE,
          colorPrimary: DARK_PRIMARY,
          colorText: "#ecf0f1"
        } : undefined
      }}
    >
      <AntdApp>
          <Layout style={{minHeight: "100vh"}}>
            <MainPage/>
          </Layout>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
