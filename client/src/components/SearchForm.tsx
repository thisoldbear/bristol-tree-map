import React, { useState } from "react";

interface ISearchFormProps {
  updateRange: any;
  initialValue: number;
}

export const SearchForm: React.FC<ISearchFormProps> = ({ updateRange, initialValue }) => {
  const [range, setRange] = useState<number>(initialValue);

  return (
    <>
      <label>
        Search range (meters)
        <input type="number" value={range} onChange={(e) => {
          setRange(parseInt(e.target.value, 10));
        }}></input>
      </label>

      <button onClick={() => updateRange(range)}>Search</button>
    </>
  );
};
