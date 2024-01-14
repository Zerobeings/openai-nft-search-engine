import type { AppProps } from "next/app";
import { 
  ThirdwebProvider,
  ConnectWallet, 
  paperWallet,
  localWallet,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
 } from "@thirdweb-dev/react";
import "../styles/globals.css";
import NextNProgress from "nextjs-progressbar";
import Head from 'next/head';
import { WalletConnect } from "@thirdweb-dev/wallets";
import { Analytics } from '@vercel/analytics/react';
import "../styles/globals.css";
import { Ethereum, Polygon, Fantom, Avalanche } from "@thirdweb-dev/chains";

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
const activeChain = "ethereum";

function MyApp({ Component, pageProps }: AppProps) {
  const walletConnectConfig = walletConnect({projectId: process.env.NEXT_PUBLIC_WALLETCONNECT as string,}); // change your project id
  walletConnectConfig.meta.name = "locatia connect (use with phone)"; // change the name
  walletConnectConfig.meta.iconURL = "https://indexer.locatia.app/icon-384x384.png"; // change the icon

  return (
    <ThirdwebProvider
    dAppMeta={{
      name: "nft-searcher",
      description: "locatia's mixtape searchbar template",
      logoUrl: "https://indexer.locatia.app/icon-384x384.png",
      url: "https://indexer.locatia.app",
      isDarkMode: true,
    }}
    clientId={process.env.NEXT_PUBLIC_CLIENT_ID as string} // change your client id
    activeChain={activeChain}
    supportedChains={[Ethereum, Polygon, Fantom, Avalanche]}
    supportedWallets={[
      metamaskWallet(), 
      localWallet({ persist: true }),
      coinbaseWallet({ recommended: true }),
      walletConnect(),
    ]}
    >
       <NextNProgress
        color="var(--color-tertiary)"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
      />
      <Head>
        <meta charSet="UTF-8"/>
        <title>nft-searcher</title>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:site" content="@art_locatia"/>
        <meta name="twitter:title" content="nft-searcher"/>
        <meta name="twitter:description" content="locatia's mixtape searchbar template."/>
        <meta name="twitter:image" content="https://indexer.locatia.app/icon-384x384.png"/>
        <meta property="og:url" content="https://indexer.locatia.app"/>
        <meta property="og:type" content="website"/>
        <meta property="og:title" content="locatia"/>
        <meta property="og:description" content="locatia's mixtape searchbar template."/>
        <meta property="og:image" content="https://indexer.locatia.app/icon-384x384.png"/>
        <link rel="manifest" href="/manifest.webmanifest"/>
      </Head>
      <Component {...pageProps} />
      <Analytics />
    </ThirdwebProvider>
  );
}

export default MyApp;
