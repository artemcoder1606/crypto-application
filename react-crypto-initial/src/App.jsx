import React from "react";
import { Layout } from "antd";
import AppHeader from "./components/layout/HeaderLayout";
import AppSider from "./components/layout/SiderLayout";
import AppContent from "./components/layout/ContentLayout";

const layoutStyle = {
  overflow: "hidden",
};

const App = () => {
  return (
    <Layout style={layoutStyle}>
      <AppHeader />
      <Layout>
        <AppSider />
        <AppContent />
      </Layout>
    </Layout>
  );
};

export default App;
