import { useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import sidebarItems from "../../data/sidebarItems";
import { useDirection } from "../../hooks/useDirection"; // custom hook returns 'ltr' or 'rtl'
import { useSettingsStore } from "../../stores/useSettingsStore";
import Logo from "../Logo";
import SliderButton from "../SliderButton";
import UserProfile from "../UserProfile";
import SidebarItem from "./SidebarItem";

export default function Sidebar() {
  const shopSettings = useSettingsStore((s) => s.shopSettings);
  const [isOpen, setIsOpen] = useState(true);
  const dir = useDirection();
  const logoSettings = useSettingsStore((s) => s.logoSettings);
  const logosrc = logoSettings?.logo;
  const toggle = () => setIsOpen((open) => !open);

  return (
    <div
      className={`flex sticky top-0 h-dvh transition-all duration-500 bg-primary text-primary-front shadow-lg ${
        isOpen ? "md:w-56" : "w-16"
      }`}
    >
      <aside className="flex flex-col h-dvh overflow-y-auto w-full">
        <SliderButton
          onClick={toggle}
          isRotate={isOpen}
          className="hidden md:block absolute end-0 hover:text-gray-100"
        >
          {isOpen === (dir === "ltr") ? <FaAngleLeft /> : <FaAngleRight />}
        </SliderButton>

        {
          <div
            className={`p-4 pt-8 flex flex-col transition-opacity duration-200 delay-300 ${
              isOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            {isOpen && (
              <div className="hidden md:block">
                <Logo src={logosrc || "/images/loddingImage.jpg"}>
                  {shopSettings?.shop_name}
                </Logo>
                <span className="h-1"></span>
                <UserProfile />
              </div>
            )}
          </div>
        }
        <hr className="text-base-front/40" />

        <nav
          className={`flex-1 flex flex-col ${
            isOpen ? "justify-center md:justify-start" : "justify-center"
          } px-2 py-4 text-sm`}
        >
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <SidebarItem key={item.link} item={item} isOpen={isOpen} />
            ))}
          </ul>
        </nav>
      </aside>
    </div>
  );
}
