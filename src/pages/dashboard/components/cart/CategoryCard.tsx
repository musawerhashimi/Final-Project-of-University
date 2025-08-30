import { Fragment } from "react/jsx-runtime";
import Card from "../../../../components/card/Card";
import { useDepartmentStore } from "../../../../stores";
import CardGridContainer from "../../../../components/card/CardGridContainer";
import { useTranslation } from "react-i18next";

interface Props {
  onBrowse: (id: number) => void;
}

function CategoryCard({ onBrowse }: Props) {
  const { t } = useTranslation();
  const departments = useDepartmentStore((s) => s.departments);
  return (
    <div>
      <CardGridContainer>
        {departments.map((department) => (
          <Fragment key={department.id}>
            {department.categories.map((category) => (
              <Card key={category.id}>
                <div className="p-4 space-y-3">
                  {/* Title */}
                  <h3 className="text-xl text-center font-semibold truncate">
                    {category.name}
                  </h3>

                  <div className="flex flex-col justify-between text-lg px-1">
                    <div className="flex justify-between">
                      <span>{t("Total Products")}</span>
                      <span>{category.total_products}</span>
                    </div>
                    <hr className="text-border-color" />

                    <div className="flex justify-between text-secondary-front">
                      <span>{t("Total Quantity")}</span>
                      <span>{category.total_quantity}</span>
                    </div>
                    <hr className="text-border-color" />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => onBrowse(category.id)}
                      className="flex-1 py-2 bg-success hover:bg-success-hover text-white rounded-lg transition-colors duration-300 text-sm"
                    >
                      {t("browse")}
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </Fragment>
        ))}
      </CardGridContainer>
    </div>
  );
}

export default CategoryCard;
