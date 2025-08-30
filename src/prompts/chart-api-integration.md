import { useEffect, useRef } from "react";
import Chart from "chart.js/auto"; // Import Chart.js

// Main App component
function VendorOverview() {
  // Ref to attach the chart to the canvas element
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const productNames: string[] = [
    "Laptop Pro X",
    "Wireless Earbuds",
    "Smartwatch Series 7",
    "Ergonomic Keyboard",
    '4K Monitor 27"',
    "External SSD 1TB",
    "External SSD 1TB",
    "External SSD 1TB",
    "External SSD 1TB",
    "External SSD 1TB",
    "External SSD 1TB",
    "External SSD 1TB",
    "External SSD 1TB",
    "External SSD 1TB",
    "External SSD 1TB",
    "External SSD 1TB",
    "External SSD 1TB",
    "External SSD 1TB",
    "External SSD 1TB",
    "External SSD 1TB",
    "External SSD 1TB",
    "External SSD 1TB",
  ];
  const totalCosts: number[] = [
    1200, 150, 300, 90, 450, 180, 450, 450, 1200, 450, 450, 800, 450, 450, 600,
    450, 450, 450, 450, 450, 450,
  ];

  useEffect(() => {
    // Get the canvas context
    const ctx = chartRef.current?.getContext("2d");

    if (ctx) {
      // Destroy existing chart instance if it exists to prevent re-rendering issues
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      // Create the Bar Chart
      chartInstanceRef.current = new Chart(ctx, {
        type: "bar", // Type of chart: Bar chart
        data: {
          labels: productNames, // Product names on the X-axis
          datasets: [
            {
              label: "Total Cost ($)", // Label for the dataset
              data: totalCosts, // Total costs for each product
              backgroundColor: [
                // Gradient or solid colors for bars
                "rgba(75, 192, 192, 0.8)",
                "rgba(153, 102, 255, 0.8)",
                "rgba(255, 159, 64, 0.8)",
                "rgba(54, 162, 235, 0.8)",
                "rgba(255, 99, 132, 0.8)",
                "rgba(201, 203, 207, 0.8)",
              ],
              borderColor: [
                // Border colors for bars
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(201, 203, 207, 1)",
              ],
              borderWidth: 1,
              borderRadius: 8, // Rounded corners for bars
              hoverBackgroundColor: [
                // Lighter hover colors
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(201, 203, 207, 1)",
              ],
              hoverBorderColor: [
                // Slightly darker hover borders
                "rgba(75, 192, 192, 1.2)",
                "rgba(153, 102, 255, 1.2)",
                "rgba(255, 159, 64, 1.2)",
                "rgba(54, 162, 235, 1.2)",
                "rgba(255, 99, 132, 1.2)",
                "rgba(201, 203, 207, 1.2)",
              ],
            },
          ],
        },
        options: {
          responsive: true, // Make the chart responsive
          maintainAspectRatio: false, // Allow canvas to resize freely
          plugins: {
            legend: {
              display: true,
              position: "top", // Position of the legend
              labels: {
                font: {
                  size: 14,
                  family: "Inter",
                },
                color: "#334155", // Legend label color
              },
            },
            title: {
              display: false, // Title is handled by H1 tag
            },
            tooltip: {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              titleFont: {
                size: 16,
                family: "Inter",
                weight: "bold",
              },
              bodyFont: {
                size: 14,
                family: "Inter",
              },
              padding: 12,
              cornerRadius: 8,
              displayColors: false, // Hide color box in tooltip
              callbacks: {
                label: function (context) {
                  let label = context.dataset.label || "";
                  if (label) {
                    label += ": ";
                  }
                  if (context.parsed.y !== null) {
                    label += new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(context.parsed.y);
                  }
                  return label;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Total Cost ($)",
                font: {
                  size: 16,
                  family: "Inter",
                  weight: "bold",
                },
                color: "#475569",
              },
              ticks: {
                font: {
                  size: 12,
                  family: "Inter",
                },
                color: "#64748b",
                callback: function (value: string | number) {
                  return value + "$"; // Add dollar sign to Y-axis labels
                },
              },
              grid: {
                color: "#e2e8f0", // Lighter grid lines
              },
            },
            x: {
              title: {
                display: true,
                text: "Product Name",
                font: {
                  size: 16,
                  family: "Inter",
                  weight: "bold",
                },
                color: "#475569",
              },
              ticks: {
                font: {
                  size: 12,
                  family: "Inter",
                },
                color: "#64748b",
              },
              grid: {
                display: false, // Hide X-axis grid lines
              },
            },
          },
        },
      });
    }

    // Cleanup function to destroy the chart instance when the component unmounts
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [productNames, totalCosts]); // Re-run effect if data changes

  return (
    <div className=" flex justify-center items-center p-4">
      <div className="chart-container bg-white rounded-3xl shadow-xl  p-8 w-96  md:w-full flex flex-col items-center border border-e2e8f0">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-8 text-center">
          Vendor Overview
        </h1>
        <div className="w-full h-96">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </div>
  );
}

export default VendorOverview;



@action(detail=True, methods=['get'])
    def stats(self, request, pk=None):
        vendor = self.get_object()
        
        # Step 1: Get all PurchaseItems grouped by variant, purchase currency & date
        items = PurchaseItem.objects.filter(purchase__vendor=vendor).select_related('purchase__currency', 'variant').values(
            'variant__variant_name',
            'purchase__currency_id',
            'purchase__purchase_date'
        ).annotate(
            total_quantity=Sum('quantity'),
            total_amount=Sum('line_total'),
        )

        # Step 2: Find the applicable currency rates in one go
        # First, get all unique (currency_id, purchase_date)
        currency_date_set = {(item['purchase__currency_id'], item['purchase__purchase_date']) for item in items}

        # Load the latest applicable CurrencyRate for each (currency_id, date)
        currency_date_to_rate = {}
        for currency_id, purchase_date in currency_date_set:
            rate = CurrencyRate.objects.filter(
                currency_id=currency_id,
                effective_date__lte=purchase_date
            ).order_by('-effective_date').first()
            if rate:
                currency_date_to_rate[(currency_id, purchase_date)] = rate.rate

        # Step 3: Now compute the adjusted total_amounts and group by variant
        variant_totals = defaultdict(lambda: {"total_quantity": 0, "total_amount": Decimal('0.0')})

        for item in items:
            key = item["variant__variant_name"]
            currency_id = item["purchase__currency_id"]
            purchase_date = item["purchase__purchase_date"]
            rate = currency_date_to_rate.get((currency_id, purchase_date), Decimal('1.0'))

            variant_totals[key]["total_quantity"] += item["total_quantity"]
            variant_totals[key]["total_amount"] += item["total_amount"] / rate

        # Step 4: Prepare final list
        result = [
            {
                "name": variant_name,
                "total_quantity": data["total_quantity"],
                "total_amount": round(data["total_amount"], 2)
            }
            for variant_name, data in variant_totals.items()
        ]

        
        # Step 1: Get all purchases for the vendor
        purchases = Purchase.objects.filter(
            vendor=vendor  # pass vendor ID or object
        ).values(
            'currency_id',
            'purchase_date'
        ).annotate(
            total_amount=Sum('total_amount')
        )

        # Step 2: Collect needed (currency_id, date) pairs
        currency_date_set = {(p['currency_id'], p['purchase_date']) for p in purchases}

        # Step 3: Map (currency, date) → applicable rate
        currency_date_to_rate = {}
        for currency_id, purchase_date in currency_date_set:
            rate = CurrencyRate.objects.filter(
                currency_id=currency_id,
                effective_date__lte=purchase_date
            ).order_by('-effective_date').first()
            if rate:
                currency_date_to_rate[(currency_id, purchase_date)] = rate.rate

        # Step 4: Compute base-currency total
        total_spent = Decimal('0.0')

        for purchase in purchases:
            currency_id = purchase['currency_id']
            purchase_date = purchase['purchase_date']
            rate = currency_date_to_rate.get((currency_id, purchase_date), Decimal('1.0'))
            total_spent += purchase['total_amount'] / rate
        
        # return Response(result)
        return Response(
            {
                "statistics": result,
                "total_amount": total_spent
            }
        )



endpoint: apiClient.get(/vendors/vendors/{id}/stats)

you can use @tanstack/react-query if you want

connect the front to back
and improve the code bro
if you have any question ask