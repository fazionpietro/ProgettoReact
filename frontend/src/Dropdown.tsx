import React, { useState } from "react";
import "./stylesheets/Dropdown.css";

type DropdownProps = {
    itemList: string[];
    selectedValue: string;
    setSelectedValue: (value: string) => void;
};

function Dropdown({
    itemList,
    selectedValue,
    setSelectedValue,
}: DropdownProps) {
    const handleChange = (event: any) => {
        setSelectedValue(event.target.value);
    };

    return (
        <select value={selectedValue} onChange={handleChange}>
            {itemList.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
}

export default Dropdown;
