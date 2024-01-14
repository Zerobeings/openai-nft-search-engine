import React, { useState } from 'react';
import styles from './Filter.module.css'; // Import your CSS file
import {FilterSVG} from './FilterSVG';
import { useEffect } from 'react';

interface Props {
    attributes: Attributes;
    onAttributeSelect: (attribute: string, startToken: number) => void;
}

interface Attributes {
    [key: string]: string[];
  }

export default function Filter({ attributes, onAttributeSelect}: Props){
  const [showPopup, setShowPopup] = useState(false);
  const [startToken, setStartToken] = useState(0);
  const [totalNFTs, setTotalNFTs] = useState(10000);

  const togglePopup = () => setShowPopup(!showPopup);

    const handleSelection = (e:any) => {
        const selectedName = e.target.getAttribute('data-attribute-label');
        const selectedValue = e.target.value;
        const finalSelection = `"${selectedName}" = "${selectedValue}"` !== undefined ? `"${selectedName}" = "${selectedValue}"` : "";
        onAttributeSelect(finalSelection, startToken);
    };

    const handleTokenChange = (e:any) => {
        const newStartToken = e.target.value;
        setStartToken(newStartToken);
        const finalSelection = "";
        onAttributeSelect(finalSelection, newStartToken);
    };


  return (
    <div className={styles.popupContainer}> 
      <button className={styles.togglePopup} onClick={togglePopup}>
        <FilterSVG />
      </button>
      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupItem}>
            <label>Token Start</label>
            <select 
            id="tokenStart" 
            name="tokenStart"
            value={startToken} 
            onChange={handleTokenChange}
            >
                <option value={0}>{0}</option>
                <option value={50}>{50}</option>
             {
                Array.from({ length: Math.ceil(totalNFTs / 100) }, (_, index) => (
                <option key={index} value={(index + 1) * 100}>{(index + 1) * 100}</option>
                ))
            }
            </select>
          </div>
          <div className={styles.popupItem}>
            <label>Traits</label>
            {Object.entries(attributes).map(([attributeLabel, values], index) => (
              <select 
                key={index} 
                data-attribute-label={attributeLabel} 
                onChange={handleSelection}
              >
                <optgroup label={attributeLabel}>
                {Array.isArray(values) && values.map((value, valueIndex) => (
                <option key={valueIndex} value={value}>{value}</option>
                ))}
                </optgroup>
              </select>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
