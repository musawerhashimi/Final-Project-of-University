import { useTranslation } from "react-i18next";
import Card from "../../../../components/card/Card";
import CardGridContainer from "../../../../components/card/CardGridContainer";
import { useDepartmentStore } from "../../../../stores";

interface Props {
  onBrowse: (id: number) => void;
}

function DepartmentCard({ onBrowse }: Props) {
  const { t } = useTranslation();
  const departments = useDepartmentStore((s) => s.departments);
  return (
    <div>
      <CardGridContainer>
        {departments.map((department) => (
          <Card key={department.id}>
            <div className="p-4 space-y-3">
              <h3 className="text-xl text-center font-semibold truncate">
                {department.name}
              </h3>

              <div className="flex flex-col justify-between text-lg px-1">
                <div className="flex justify-between">
                  <span>{t("Total Products")}</span>
                  <span>{department.total_products}</span>
                </div>
                <hr className="text-border-color" />

                <div className="flex justify-between text-secondary-front">
                  <span>{t("Total Quantity")}</span>
                  <span>{department.total_quantity}</span>
                </div>
                <hr className="text-border-color" />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onBrowse(department.id)}
                  className="flex-1 py-2 bg-success hover:bg-success-hover text-white rounded-lg transition-colors duration-300 text-sm"
                >
                  {t("browse")}
                </button>
              </div>
            </div>
          </Card>
        ))}
      </CardGridContainer>
    </div>
  );
}

export default DepartmentCard;
