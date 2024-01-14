import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { NextPage } from "next";
import {PoweredBy} from "../components/PoweredBy/PoweredBy";
import {GitHub} from "../components/PoweredBy/GitHub";
import {Request} from "../components/PoweredBy/Request";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
const NFTSearcherPackNOSSR = dynamic(() => import('../components/NFTSearcher/Searchbar'), { ssr: false });

const Home: NextPage = () => {
  
  return (
    <main>
      <div className={styles.container}>
      <NFTSearcherPackNOSSR/>
      </div>
      <div className={styles.headerBg}>
        <Request />
        <div className={styles.wallet}>
        <ConnectWallet />
        </div>
      </div>
      <PoweredBy />
      <GitHub />
    </main>
  );
};

export default Home;
