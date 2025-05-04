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
    <option value="Utente">Utente</option>
    <option value="Personal Trainer">Personal Trainer</option>
    <option value="Medico">Medico</option>
    </select>
    );
}

export default Dropdown;