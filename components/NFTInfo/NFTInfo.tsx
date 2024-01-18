import React from 'react';
import styles from './NFTInfo.module.css'; // Ensure this path is correct

interface NFTInfoProps {
  data: string | { [key: string]: any };  // Accepting either a JSON string or an object
}

const NFTInfo: React.FC<NFTInfoProps> = ({ data }) => {
  const jsonData = typeof data === 'string' ? JSON.parse(data) : data;

  const formatTitle = (key: string) => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const renderData = (obj: { [key: string]: any }) => {
    return Object.keys(obj).map((key) => {
      const value = obj[key];
      if (typeof value === 'object' && value !== null) {
        return (
          <div key={key} className={styles.item}>
            <strong>{formatTitle(key)}:</strong>
            <div style={{ marginLeft: '20px' }}>{renderData(value)}</div>
          </div>
        );
      } else {
        return (
          <div key={key} className={styles.item}>
            <strong>{formatTitle(key)}:</strong> {value}
          </div>
        );
      }
    });
  };

  return <div className={styles.container}>{renderData(jsonData)}</div>;
};

export default NFTInfo;
