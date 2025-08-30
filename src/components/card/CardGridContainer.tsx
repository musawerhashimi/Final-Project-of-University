import { type ReactNode } from "react";

interface Props {
  children: ReactNode | ReactNode[];
}
function CardGridContainer({ children }: Props) {
  return (
    <div className="pb-10 p-3 grid gap-4 grid-cols-[repeat(auto-fit,minmax(230px,1fr))]">
      {children}
    </div>
  );
}

export default CardGridContainer;
