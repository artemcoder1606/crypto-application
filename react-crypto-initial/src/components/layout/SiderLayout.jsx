import React from "react";
import { Layout, Card, Statistic, List, Typography, Spin, Tag } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { fakeFetchCrypto, fetchCrypto } from "../../api";
import { capitalize } from "./utils";

const siderStyle = {
  padding: "1rem",
};

export default function AppSider() {
  const [loading, setLoading] = React.useState(false);
  const [fakeCrypto, setFakeCrypto] = React.useState([]);
  const [assets, setAssets] = React.useState([]);

  React.useEffect(() => {
    async function preload() {
      setLoading(true);
      const assets = await fetchCrypto();
      const { result } = await fakeFetchCrypto();
      setFakeCrypto(result);
      function percentDifference(a, b) {
        if (a === 0 && b === 0) return 0;
        return (Math.abs(a - b) / ((a + b) / 2)) * 100;
      }

      setAssets(
        assets.map((asset) => {
          const coin = result.find((c) => c.id === asset.id);

          return {
            grow: asset.price < coin.price,
            growPercent: percentDifference(asset.price, coin.price),
            totalAmount: asset.amount * coin.price,
            totalProfit: asset.amount * coin.price - asset.amount * asset.price,
            ...asset,
          };
        })
      );
      setLoading(false);
    }
    preload();
  }, []);
  {
    if (loading) return <Spin fullscreen />;
  }
  return (
    <Layout.Sider width="25%" style={siderStyle}>
      {assets.map((asset) => (
        <Card key={asset.id} style={{ marginBottom: "1rem" }}>
          <Statistic
            title={capitalize( asset.id)}
            value={asset.totalAmount}
            precision={2}
            valueStyle={{ color: asset.grow ? "#3f8600" : "#cf1322" }}
            prefix={asset.grow ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            suffix="$"
          />
          <List
            size="small"
            dataSource={[
              { title: "Total Profit", value: asset.totalProfit, withTag: true },
              { title: "Asset Amount", value: asset.amount, isPlain: true },
              // { title: "Difference", value: asset.growPercent },
            ]}
            renderItem={(item) => (
              <List.Item>
                <span>{item.title}</span>
                <span>
                {item.isPlain && item.value}
                {item.withTag && <Tag color={asset.grow ? "green" : "red"}>{asset.growPercent.toFixed(2)}%</Tag>}
                {!item.isPlain && (
                  <Typography.Text type={asset.grow ? "success" : "danger"}>
                    {item.value.toFixed(2) + "$"}
                  </Typography.Text>
                )}
                </span>
              </List.Item>
            )}
          />
        </Card>
      ))}
    </Layout.Sider>
  );
}
