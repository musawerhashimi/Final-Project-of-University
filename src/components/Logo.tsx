interface Props {
  src?: string;
  children?: string;
}

function Logo({ src, children }: Props) {
  return (
    <div className="flex items-center">
      <div>
        <img className="h-18 w-18 rounded-full" src={src} alt="" />
      </div>
      <span className="text-lg font-bold mx-2">{children}</span>
    </div>
  );
}

export default Logo;
