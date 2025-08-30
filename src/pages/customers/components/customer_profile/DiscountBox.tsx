interface discountPrp {
  percentage: number;
  label: string;
}
export default function DiscountCircle({ percentage, label }: discountPrp) {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-24 h-24 rounded-full flex items-center justify-center border-4 border-blue-500 text-blue-500 font-bold text-xl mb-2">
        {percentage}%
        <div
          className="absolute inset-0 rounded-full border-4 border-gray-200"
          style={{ clipPath: `inset(0 ${100 - percentage}% 0 0)` }}
        ></div>
      </div>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
}
