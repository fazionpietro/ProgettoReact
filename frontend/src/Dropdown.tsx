import React, { useState } from "react";
import "./stylesheets/Dropdown.css";

type DropdownProps = {
    itemList: string[];
    setSelectedValue: (value: string) => void;
};

function Dropdown({ itemList, setSelectedValue }: DropdownProps) {
    const handleChange = (event: any) => {
        setSelectedValue(event.target.value);
    };

    return (
        <select onChange={handleChange}>
            <option value="">Select Option</option>
            {itemList.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
}

export default Dropdown;
