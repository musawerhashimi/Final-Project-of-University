import { useState } from "react";
import { TreePine, Sun, Leaf, Snowflake } from "lucide-react"; // Importing icons from lucide-react
import RouteBox from "../../../../components/RouteBox";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function MonthlyReport() {
  const { t } = useTranslation();
  const route = [
    { name: t("Reports"), path: "/reports" },
    { name: t("Monthly Report"), path: "" },
  ];
  const [year, setYear] = useState<number>(2025); // State to hold the current year

  // Generate a list of years for the dropdown
  const years = Array.from({ length: 10 }, (_, i) => 2020 + i); // Years from 2020 to 2029

  const seasons = [
    {
      name: t("Spring"),
      icon: TreePine,
      color: "text-green-500",
      months: [
        { name: "January", year: year, link: `${year}/1` },
        { name: "February", year: year, link: `${year}/2` },
        { name: "March", year: year, link: `${year}/3` },
      ],
    },
    {
      name: t("Summer"),
      icon: Sun,
      color: "text-yellow-500",
      months: [
        { name: "April", year: year, link: `${year}/4` },
        { name: "May", year: year, link: `${year}/5` },
        { name: "June", year: year, link: `${year}/6` },
      ],
    },
    {
      name: t("Fall"),
      icon: Leaf,
      color: "text-orange-500",
      months: [
        { name: "July", year: year, link: `${year}/7` },
        { name: "August", year: year, link: `${year}/8` },
        { name: "September", year: year, link: `${year}/9` },
      ],
    },
    {
      name: t("Winter"),
      icon: Snowflake,
      color: "text-blue-400",
      months: [
        { name: "October", year: year, link: `${year}/10` },
        { name: "November", year: year, link: `${year}/11` },
        { name: "December", year: year, link: `${year}/12` },
      ],
    },
  ];

  return (
    <>
      <RouteBox items={route} routlength={route.length} />
      <div className=" flex flex-col items-center p-4 ">
        {/* Header Section */}
        <header className="w-full bg-blue-600 p-4 rounded-b-lg shadow-md flex flex-col md:flex-row items-center justify-between">
          <h1 className="text-white text-2xl font-bold mb-4 md:mb-0">
            {t("Monthly Report")}
          </h1>
          <div className="flex items-center space-x-2 w-full md:w-auto">
            {/* Year Selection Box */}
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-32 text-center text-white bg-blue-500"
              aria-label="Select year"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <Link
              to={`/reports/monthlyReport/${year}`}
              className="bg-white text-blue-600 font-semibold py-2 px-4 rounded-md shadow hover:bg-gray-100 transition-colors duration-200"
            >
              {t("Full Year Report")}
            </Link>
          </div>
        </header>

        {/* Main Content Area - Seasons Grid */}
        <main className="container mx-auto mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
          {seasons.map((season) => (
            <div
              key={season.name}
              className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 flex flex-col items-start"
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                {season.name}
              </h2>
              <ul className="space-y-3 w-full">
                {season.months.map((month) => {
                  const IconComponent = season.icon; // Get the icon component dynamically
                  return (
                    <li key={month.name} className="flex items-center">
                      <IconComponent
                        className={`mr-2 ${season.color}`}
                        size={18}
                      />{" "}
                      {/* Render icon with color */}
                      <Link
                        to={month.link}
                        className={`text-gray-700 hover:text-blue-600 transition-colors duration-200 ${season.color}`}
                        aria-label={`View report for ${month.name} ${month.year}`}
                      >
                        {month.name}({month.year})
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </main>
      </div>
    </>
  );
}

export default MonthlyReport;
