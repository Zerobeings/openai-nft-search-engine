import NFTSearcher from "nft-searcher"
import { useState, useEffect, useCallback } from "react";
import styles from "./Searchbar.module.css";
import NFTCard from "../NFTCard/NFTCard";
import Filter from "../Filter/Filter";
import Image from "next/image";
import { useChain, ConnectWallet } from "@thirdweb-dev/react";
import NFTInfo from "../NFTInfo/NFTInfo";

interface Attributes {
  [key: string]: string[];
}

export default function NFTSearcherPackNOSSR(){
  const [fetchedNFTs, setFetchedNFTs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [attributes, setAttributes] = useState<Attributes>({});
  const [allNFTs, setAllNFTs] = useState<any[]>([]);
  const chain = useChain();
  const [network, setNetwork] = useState<string>("");
  const [aiAnalysis, setAiAnalysis] = useState(null);

  // set network and feed into searcher tool
  useEffect(() => {
    if (chain && chain.chain.toLowerCase() === "eth") {
      setNetwork("ethereum");
    } else if (chain && chain.chain.toLowerCase() === "polygon") {
      setNetwork("polygon");
    } else if (chain && chain.chain.toLowerCase() === "avax") {
      setNetwork("avalanche");
    } else if (chain && chain.chain.toLowerCase() === "ftm") {
      setNetwork("fantom");
    }
  }, [chain]);

  const extractAttributes = useCallback((nfts: any[]) => {
    const attributeMap: Attributes = {};
    nfts.forEach(nft => {
      if (nft.metadata && nft.metadata.attributes) {
        nft.metadata.attributes.forEach((attribute: any) => {
          if (!attributeMap[attribute.trait_type]) {
            attributeMap[attribute.trait_type] = [];
          }

          if (!attributeMap[attribute.trait_type].includes(attribute.value)) {
            attributeMap[attribute.trait_type].push(attribute.value);
          }
        });
       } else if (nft.attributes) {
          Object.entries(nft.attributes || {}).forEach(([key, value]) => {
            if (!attributeMap[key]) {
              attributeMap[key] = [];
            }

            if (typeof value === 'string' && !attributeMap[key].includes(String(value))) {
              attributeMap[key].push(value);
            }
          });
        }
      });

    return attributeMap;
  }, []);

  const handleNFTsFetched = useCallback((nfts: any[]) => {
    setLoading(true);
    setFetchedNFTs(nfts);
    setAllNFTs(nfts);
    const attributes = extractAttributes(nfts);
    setAttributes(attributes);
    setInterval(() => {
        setLoading(false);
    }, 1000);
}, [setLoading, setFetchedNFTs, setAllNFTs, setAttributes, extractAttributes]);

  console.log("fetchedNFTs", fetchedNFTs);

  // search params
  const [limit, setLimit] = useState<number>(100);
  const [start, setStart] = useState<number>(0);
  const [where, setWhere] = useState<any[]>([]); //only required for nft-indexer searches, does not apply thirdweb contract searches
  const [select, setSelect] = useState<string>("*"); //only required for nft-indexer searches, does not apply thirdweb contract searches

  const handleAttributeFromCard = async (selectedAttribute:string, tokenStart:number) => {
    setStart(tokenStart);
      const updateNFTs = fetchedNFTs.filter((nft) => {
        if (nft.metadata && nft.metadata.attributes) {   
          return nft.metadata.attributes.some((attribute: any) => {
            return selectedAttribute.includes(attribute.trait_type) && selectedAttribute.includes(attribute.value);
          });
        } else if (nft.attributes) {
            const whereNew = selectedAttribute !== "" ? [selectedAttribute] as any[] : [] as any[];
            setWhere(whereNew);
          return Object.entries(nft.attributes || {}).some(([key, value]) => {
            return selectedAttribute.includes(key) && selectedAttribute.includes(String(value));
          });
          }
      });
      setFetchedNFTs(updateNFTs);
  }

  const handleClearSearch = () => {
    const clear = "";
    handleAttributeFromCard(clear, 0);
    setFetchedNFTs(allNFTs);
  }


  // fetch AI analysis
  useEffect(() => {
    const fetchAIAnalysis = async () => {
      if (fetchedNFTs && fetchedNFTs.length > 0) {
        const tokenName = fetchedNFTs[1]?.metadata?.name ? fetchedNFTs[1].metadata.name : fetchedNFTs[1].name;
        const tokenDescription = fetchedNFTs[1]?.metadata?.description ? fetchedNFTs[1].metadata.description : fetchedNFTs[1].description;
          try {
            const response = await fetch('/api/openai', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({tokenName, tokenDescription}),
            });
          
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            setAiAnalysis(data.data);
          } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
          }
      }
    }
    fetchAIAnalysis();
  }, [fetchedNFTs]);


  return (
    <>
    <h1 className={styles.mainHeading}>A searchbar for 
      <a href="https://thirdweb.com"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
      > thirdweb </a> 
      projects & more
    </h1>
    <h3 className={styles.heading}>yarn add nft-searcher</h3>
    <div className={styles.container}>
      <div className={styles.mixtape}> 
        <button className={styles.button} onClick={() => setDarkMode(!darkMode)}>Toggle Searchbar Theme</button>
        <NFTSearcher 
            activeNetwork={network}
            theme={darkMode ? "dark" : "light"} // "light" or "dark"
            onNFTsFetched={handleNFTsFetched}
            limit={limit}
            start={start}
            where={where}
            select={select}
        />
      </div>
      <div className={styles.console}>
        <h4>NFT Console</h4>
        {fetchedNFTs.length === 0 ? (
          <p>No NFTs fetched yet...</p>
        ) : (
          <>
            {!loading ? fetchedNFTs.map((nft, index) => (
                <div key={index}>
                  <pre>{JSON.stringify(nft, null, 2)}</pre>
                </div>
            ))
            : <div style={{ marginLeft: "auto", marginRight: "auto", }}>Loading...</div>}
          </>
        )}
      </div>
    </div>
    <div className={styles.aiconsole}>
      {aiAnalysis ? (
          <div>
            <h3>OpenAI generated Collection Insights</h3>
            <NFTInfo data={aiAnalysis} />
          </div>
        )
        :  
        <div>
          <h3>OpenAI generated Collection Insights</h3>
          <p>Search a collection to generate insights...</p> 
        </div>
      }
      </div>
    <div className={styles.selectorContainer}>
      <Filter attributes={attributes} onAttributeSelect={handleAttributeFromCard}></Filter>
      <p className={styles.instructions}>&larr; filter by token and trait or reset trait selection &rarr;</p>
      <div className={styles.selection}>
          <button className={styles.resetBtn} onClick={handleClearSearch}><Image src="/images/reset.png" width={22} height={22} alt="reset"/></button>
      </div> 
    </div>
    <div className={styles.gridContainer}>
      <div className={styles.grid}>
        {fetchedNFTs.length === 0 ? (
            <p>No NFTs fetched yet...</p>
        ) : fetchedNFTs && fetchedNFTs.length > 0 ? (
            fetchedNFTs.map((nft, i) => (
                <NFTCard 
                nft={nft} 
                key={i} 
                network={network} 
                tokenStart={start}
                onAttributeSelect={handleAttributeFromCard}
                ></NFTCard>
            ))
        ) : ( <div style={{ marginLeft: "auto", marginRight: "auto", }}>Loading...</div>)}
      </div>
    </div>
  </>
  

  )
}