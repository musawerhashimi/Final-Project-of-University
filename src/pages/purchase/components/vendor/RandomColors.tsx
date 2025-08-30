const colorClasses = [
  "bg-cyan-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-400",
  "bg-purple-500",
  "bg-pink-500",
  "bg-lime-500",
  "bg-orange-400",
  "bg-teal-500",
];

export default function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * colorClasses.length);
  return colorClasses[randomIndex];
}
