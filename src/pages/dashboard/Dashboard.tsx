import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import CardGridContainer from "../../components/card/CardGridContainer";
import CardSkeleton from "../../components/card/CardSkeleton";
import { useInventory } from "../../hooks/inventory/useInventory";
import { useInventoryFilters } from "../../hooks/inventory/useInventoryFilters";
import { useCurrencyStore } from "../../stores";
import { useCartStore } from "../../stores/useCartStore";
import CategoryCard from "./components/cart/CategoryCard";
import DashboardNavBar from "./components/DashboardHeader";
import FilterBar from "./components/FilterBar";
import ProductCard from "./components/ProductCard";
import RightSide from "./components/RightSide";
import DepartmentCard from "./components/cart/DepartmentCard";
import WarehouseCard from "./components/cart/WarehouseCard";
import Loader from "../../components/Loader";
import apiClient from "../../lib/api";
import { toast } from "sonner";
import type { InventoryItem } from "../../entities/InventoryItem";
import { extractAxiosError } from "../../utils/extractError";
import { Can } from "../../providers/Can";
import { useTranslation } from "react-i18next";

export type ShowFilter = "category_id" | "department_id" | "warehouse_id";

export type ShowCard = ShowFilter | "items";

const Dashboard = () => {
  const { t } = useTranslation();
  const addToCart = useCartStore((state) => state.addItem);
  const setSubtotalCurrency = useCartStore((s) => s.setSubtotalCurrency);
  const subtotalCurrencyId = useCartStore((s) => s.subtotalCurrencyId);

  const NO_OF_SKELETON = 12;
  const skeletonArray = [];

  for (let index = 0; index < NO_OF_SKELETON; index++) {
    skeletonArray.push(0);
  }
  const [barcodeEnabled, setBarcodeEnabled] = useState(false);
  const toggleBarcode = () => {
    setBarcodeEnabled((prev) => !prev);
  };
  const [barcodeInput, setBarcodeInput] = useState("");
  const inputTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!barcodeEnabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const { t } = useTranslation();
      const active = document.activeElement;
      const isInputFocused =
        active &&
        (active.tagName === "INPUT" ||
          active.tagName === "TEXTAREA" ||
          (active as HTMLElement).isContentEditable);

      if (isInputFocused) {
        // User is typing manually — ignore barcode scanning input
        return;
      }

      if (e.key === "Enter") {
        if (barcodeInput.length > 0) {
          apiClient
            .get("/inventory/barcode-search", {
              params: { barcode: barcodeInput },
            })
            .then((response) => {
              const product = response.data as InventoryItem;
              addToCart(product);
              setBarcodeInput("");
            })
            .catch((error) => {
              const errorMessage = extractAxiosError(
                error,
                t("Item with this barcode Not Found!")
              );
              toast.error(errorMessage);
            })
            .finally(() => {
              setBarcodeInput("");
            });
        }
      } else if (e.key.length === 1) {
        setBarcodeInput((prev) => prev + e.key);

        if (inputTimeout.current) clearTimeout(inputTimeout.current);
        inputTimeout.current = setTimeout(() => {
          setBarcodeInput("");
        }, 300);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (inputTimeout.current) clearTimeout(inputTimeout.current);
      setBarcodeInput("");
    };
  }, [addToCart, barcodeEnabled, barcodeInput]);

  const {
    items: allItems,
    isLoading,
    hasNextPage,
    fetchNextPage,
    // togglePreference,
    error,
  } = useInventory();

  const { updateFilter } = useInventoryFilters();

  const [showCard, setShowCard] = useState<ShowCard>("items");

  const onBrowse = (filter: ShowFilter, id: number) => {
    updateFilter(filter, id);
    setShowCard("items");
  };
  const getBaseCurrency = useCurrencyStore((s) => s.getBaseCurrency);

  useEffect(() => {
    if (!subtotalCurrencyId) {
      setSubtotalCurrency(getBaseCurrency().id);
    }
  }, [getBaseCurrency, setSubtotalCurrency, subtotalCurrencyId]);

  if (error) {
    return (
      <div className="flex justify-center items-center h-dvh text-red-500">
        {t("Error loading products")}: {error.message}
      </div>
    );
  }
  return (
    <div className="flex flex-col h-dvh">
      <DashboardNavBar />
      <div className="flex relative flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col w-full min-w-0">
          <FilterBar
            barcodeEnabled={barcodeEnabled}
            toggleBarcode={toggleBarcode}
            showCard={showCard}
            setShowCard={setShowCard}
          />
          <div id="scrollableDiv" className="flex-1 overflow-y-auto">
            {showCard === "items" ? (
              <InfiniteScroll
                dataLength={allItems.length}
                hasMore={hasNextPage}
                next={() => fetchNextPage()}
                loader={
                  <div className="h-12">
                    <Loader />
                  </div>
                }
                scrollableTarget="scrollableDiv"
              >
                <CardGridContainer>
                  {isLoading ? (
                    skeletonArray.map((_i, index) => (
                      <CardSkeleton key={index} />
                    ))
                  ) : allItems.length == 0 ? (
                    <div className="p-5 text-center text-error-mock">
                      {t("No Product Found")}
                    </div>
                  ) : (
                    allItems.map((item) => (
                      <ProductCard
                        key={item.id}
                        product={item}
                        onAddToCart={() => addToCart(item)} // Use the store action
                      />
                    ))
                  )}
                </CardGridContainer>
              </InfiniteScroll>
            ) : showCard === "category_id" ? (
              <CategoryCard
                onBrowse={(id: number) => onBrowse("category_id", id)}
              />
            ) : showCard === "department_id" ? (
              <DepartmentCard
                onBrowse={(id: number) => onBrowse("department_id", id)}
              />
            ) : (
              <WarehouseCard
                onBrowse={(id: number) => onBrowse("warehouse_id", id)}
              />
            )}
          </div>
        </div>
        <Can permission="sales">
          <RightSide />
        </Can>
      </div>
    </div>
  );
};

export default Dashboard;
