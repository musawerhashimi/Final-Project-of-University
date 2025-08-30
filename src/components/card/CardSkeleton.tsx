import Card from "./Card";

function CardSkeleton() {
  return (
    <Card>
      <div className="h-70 bg-white animate-pulse"></div>
    </Card>
  );
}

export default CardSkeleton;
