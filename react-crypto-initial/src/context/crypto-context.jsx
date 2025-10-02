import React from "react";
import { createContext } from "react";
import { fakeFetchCrypto, fetchCrypto } from "../api";
import { percentDifference } from "../components/layout/utils";


const CryptoContext = createContext({
	assets: [],
	crypto: [],
	loading: false
})

export function CryptoContextProvider({children}) {
	const [loading, setLoading] = React.useState(false);
  const [fakeCrypto, setFakeCrypto] = React.useState([]);
  const [assets, setAssets] = React.useState([]);

  React.useEffect(() => {
    async function preload() {
      setLoading(true);
      const assets = await fetchCrypto();
      const { result } = await fakeFetchCrypto();
      setFakeCrypto(result);
    

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
	return <CryptoContext.Provider value={{loading, crypto, assets}}>{children}</CryptoContext.Provider>
}

export default CryptoContext;