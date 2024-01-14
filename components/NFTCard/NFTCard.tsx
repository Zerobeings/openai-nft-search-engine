import styles from './NFTCard.module.css';
import Image from 'next/image';
import { MediaRenderer } from "@thirdweb-dev/react";
import { useEffect, useState } from 'react';

interface Props {
  nft: any;
  network: string;
  onAttributeSelect: (selectedAttribute: string, tokenStart: number) => Promise<void>;
  tokenStart: number;
}

interface Attribute {
  trait_type: string;
  value: string;
}

export default function NFTCard({ nft, network, onAttributeSelect, tokenStart}: Props) {

  const handleAttributeClick = (attribute: string) => {
    onAttributeSelect(attribute, tokenStart); 
  };

  return (
    <>
    {nft?.metadata?.name !== "Failed to load NFT metadata" &&
      <div className={styles.container}>
        <div className={styles.item}>
          <h4 className={styles.heading}>{nft.name || nft?.metadata?.name}</h4>
          <MediaRenderer src={nft.image || nft?.metadata?.image} alt="image" height="233px" width="233px" />
          <table className={styles.table}>
            <tbody>
            {nft.metadata && nft.metadata.attributes!==undefined ? Object.entries(nft.metadata.attributes).map(([_, attribute]: [string, any], i) => {
              const traitType = (attribute as Attribute).trait_type;
              const value = (attribute as Attribute).value;
              return (
                  <tr key={i} onClick={() => handleAttributeClick(`"${traitType}" = "${String(value)}"`)}>
                      <td>{traitType}</td>
                      <td>{String(value)}</td>
                  </tr>
              );
            }
            ) : nft.attributes && (
              Object.entries(nft.attributes).map(([key, value], i) => {
                return (
                  <tr key={i} onClick={() => handleAttributeClick(`"${key}" = "${String(value)}"`)}>
                      <td>{key}</td>
                      <td>{String(value)}</td>
                  </tr>
                );
              })
            )}
            </tbody>
          </table>
        </div>
      </div>
    }
    </>
  );
}
