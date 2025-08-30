import { useEffect, useState, type ReactNode } from "react";

import { Link } from "react-router-dom";
import type { Permission } from "../data/permissions";
import { Can } from "../providers/Can";

export interface Box {
  path: string;
  start: string;
  duration: string;
  color: string;
  icon: ReactNode;
  name: string;
  permission?: Permission | Permission[];
  all?: boolean;
}

interface SelectBoxProp {
  items: Box[];
}

function SelectBox({ items }: SelectBoxProp) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);
  return (
    <div className="relative flex flex-col h-screen w-full bg-center bg-cover bg-[url('/images/bg-2.jpg')]">
      <div className="absolute inset-0 bg-white/30 backdrop-blur-md"></div>
      <div className="relative z-10  p-4 my-auto w-96  md:w-[700px] space-y-3  ">
        {items.map((it, index: number) => (
          <Can permission={it.permission} all={it.all}>
            <div key={index} style={{ marginInlineStart: `${it.start}` }}>
              <Link
                to={it.path}
                className={`transition-all ${
                  it.duration
                } delay-75 ease-out  transform ${
                  show
                    ? "translate-y-0 opacity-100"
                    : "translate-y-50 opacity-0"
                } flex items-center  gap-2 my-3  ${
                  it.color
                } text-white  px-3 py-1.5 rounded-full  hover:shadow-md shadow-green-600 `}
              >
                {it.icon}
                {it.name}
              </Link>
            </div>
          </Can>
        ))}
      </div>
    </div>
  );
}

export default SelectBox;
