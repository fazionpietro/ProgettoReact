
import "../stylesheets/Dropdown.css";

type DropdownProps = {
    itemList: string[];
    setSelectedValue: (value: string) => void;
    value?: string; 
};

function Dropdown({ itemList, setSelectedValue, value}: DropdownProps) {
    const handleChange = (event: any) => {
        setSelectedValue(event.target.value);
    };

    return (
        <select value={value || ""} onChange={handleChange}>
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
