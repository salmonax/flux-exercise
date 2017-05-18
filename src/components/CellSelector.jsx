import React from 'react';

const CellSelector = (props) => {
  return (
    <div className='select' onChange={props.select}>
      <select className='cell'>
        <option>Please select a cell</option>
        {props.cells.map(cell =>
          <option key={cell.id}>{cell.label}</option>
        )}
      </select>
    </div>
  );
};

export default CellSelector;
