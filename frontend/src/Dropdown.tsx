import React, { useState } from 'react'; 
import './stylesheets/Dropdown.css'


type DropdownProps = {
  selectedValue: string;
  setSelectedValue: (value: string) => void;
};

function Dropdown( {selectedValue, setSelectedValue }: DropdownProps) {
  const handleChange = (event : any) => {
    setSelectedValue(event.target.value); 
  }


  return (
    <select value={selectedValue} onChange={handleChange}>
    <option value="utente">utente</option>
    <option value="personalTrainer">personalTrainer</option>
    <option value="medico">medico</option>
    </select>
    );
}

export default Dropdown;