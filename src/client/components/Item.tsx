import React from 'react';
import '../../styles/itemStyle.css';
// interface ItemProps {
//   title: string;
// }

const Item = ({ title }) => {
  return (
    <div className="item-card">
      <div className="item-card-content">
        <h2 className="item-card-title">{title}</h2>
      </div>
    </div>
  );
};
export default Item;
