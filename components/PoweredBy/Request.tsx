import styles from "./PoweredBy.module.css";

export const Request: React.FC = () => {
    return (

<div onClick={() => {
    window.open("https://github.com/Zerobeings/nft-indexer", "_blank");
    }
  }
    className={styles.request}
    >
    To add your collection to the suggestion list, please open an issue on the GitHub repo.
  </div>
    );
}