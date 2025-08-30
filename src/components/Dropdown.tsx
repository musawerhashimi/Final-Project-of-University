import { useState } from "react";
import { FaAngleDown } from "react-icons/fa";
interface Item {
  key: string | number;
  value: string | number;
}
interface Props {
  items: Item[];
  defaultItem?: Item;
  onChange: (key: string | number) => void;
}

function Dropdown({ items, defaultItem = items[0], onChange }: Props) {
  const [isOpen, setOpen] = useState(false);
  const toggle = () => setOpen(!isOpen);
  return (
    <div className="relative box-border">
      <div
        onClick={toggle}
        className={`cursor-pointer p-0.5 rounded-sm ${isOpen && "bg-primary"}`}
      >
        <button>{defaultItem.value}</button>
        <FaAngleDown className="inline" />
      </div>
      {isOpen && (
        <div className="absolute overflow-hidden rounded-sm bottom-10 -left-5 w-20 bg-primary">
          <ul className="">
            {items.map((item) => (
              <li
                className="hover:bg-hover-effect px-2 cursor-pointer"
                key={item.key}
                onClick={() => {
                  setOpen(false);
                  onChange(item.key);
                }}
              >
                {item.value}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
export default Dropdown;
