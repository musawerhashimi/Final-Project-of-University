import { Edit } from "lucide-react";
import React, { useState, useRef } from "react";
import { FaPlus } from "react-icons/fa";
import EditableField from "./EditabelField";
import {
  useCurrencyStore,
  useDepartmentStore,
  useUnitStore,
} from "../../../../stores";

// Define the structure for our product details
interface ProductDetails {
  id: string; // Unique ID for the product
  name: string;
  available: number;
  sold: number;
  returned: number;
  purchased: number;
  department: string;
  category: string;
  reorderLevel: number;
  description: string;
  unitChange: string;
  currency: string;
  realPrice: number;
}
const testdata: ProductDetails = {
  id: "1",
  name: "N141-silver-160",
  available: 28,
  sold: 11,
  returned: 0,
  purchased: 39,
  department: "Electronics", // Changed default for better example
  category: "Gadgets", // Changed default for better example
  reorderLevel: 10,
  description:
    "This is a premium silver product, model N141-160. It offers exceptional performance and durability, suitable for a wide range of applications. Its sleek design and robust build quality make it a top choice in its category.",
  unitChange: "Each",
  realPrice: 12.99,
  currency: "USD",
};
// Main Product Details Page Component
function ProductDetailsPage() {
  // Initial product data
  const [product, setProduct] = useState<ProductDetails>(testdata);

  const currency = useCurrencyStore((s) => s.currencies);
  const unitChangeOptions = useUnitStore((s) => s.units);
  const departments = useDepartmentStore((s) => s.departments);
  const categories = departments[0].categories;
  // let categoryOptions: Category[] | undefined;
  
  // Handler to update any field in the product state
  const handleFieldChange = (
    field: keyof ProductDetails,
    newValue: string | number
  ) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      [field]: newValue,
    }));
  };
  const images = "/images/logo.jpg";

  const [image, setImage] = useState(images);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit image handler
  const handleEditImage = () => {
    fileInputRef.current?.click();
  };

  // Handle file input change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) setImage(ev.target.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white w-full rounded-3xl shadow-2xl ">
      {/* Header Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 bg-blue-100 text-white p-6 text-center rounded-t-2xl">
        <div className="relative ">
          {image ? (
            <img
              src={image}
              alt="Logo"
              className="h-auto w-full border-1 border-gray-300 shadow"
            />
          ) : (
            <div className="h-full bg-gray-300 flex items-center justify-center">
              <FaPlus className="h-25 w-25 bg-blue-500 text-white rounded-full p-2" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
          />
          <button
            className="absolute bottom-0 end-0 text-blue-500  "
            title="Edit Image"
            onClick={handleEditImage}
          >
            <Edit className="h-10 w-10 " />
          </button>
        </div>
        <div className=" border-y border-gray-400 ">
          <EditableField
            label="Product Name"
            value={product.name}
            type="text"
            onSave={(val) => handleFieldChange("name", val)}
            className="mx-auto mb-8 mt-3 w-80 bg-gray-100  rounded-xl" // Override text color for header
          />

          <p className="font-semibold text-gray-500">Barcode Number</p>
          <p className="font-bold text-blue-600 ">112272736363</p>
          {/* Product History Section */}

          <div className="p-6 ">
            <h2 className="text-2xl font-bold mb-4 text-indigo-800">
              Product History
            </h2>
            <div className="bg-blue-200">
              <table className="w-full text-black ">
                <tr className="border-2  border-gray-200 ">
                  <th className="p-1 bg-green-100">Available</th>
                  <td>200</td>
                </tr>
                <tr className="border-2 border-gray-200 ">
                  <th className="p-1 bg-green-100">Purchase</th>
                  <td>500</td>
                </tr>
                <tr className="border-2 border-gray-200 ">
                  <th className="p-1 bg-green-100">Sold</th>
                  <td>20</td>
                </tr>
                <tr className="border-2 border-gray-200 ">
                  <th className="p-1 bg-green-100">Returned</th>
                  <td>0</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
        <div className=" p-2 border border-gray-400 ">
          {/* Product Specifications Section */}
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-indigo-800">
              Product Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <EditableField
                label="Department"
                value={product.department}
                options={departments.map((dept) => dept.name)}
                type="select"
                className="mx-auto w-40 mt-2  bg-gray-100  rounded-xl" // Override text color for header
                onSave={(val) => handleFieldChange("department", val)}
              />

              <EditableField
                label="Category"
                value={product.category}
                type="select"
                options={categories.map((cat) => cat.name)}
                className="mx-auto w-40 mt-2  bg-gray-100  rounded-xl" // Override text color for header
                onSave={(val) => handleFieldChange("category", val)}
              />

              <EditableField
                label="Reorder Level"
                value={product.reorderLevel}
                className="mx-auto w-40 mt-2  bg-gray-100  rounded-xl" // Override text color for header
                type="number"
                onSave={(val) => handleFieldChange("reorderLevel", val)}
              />

              <EditableField
                label="Unit Change"
                value={product.unitChange}
                type="select"
                options={unitChangeOptions.map((unit) => unit.abbreviation)}
                className="mx-auto w-40 mt-2  bg-gray-100  rounded-xl" // Override text color for header
                onSave={(val) => handleFieldChange("unitChange", val)}
              />

              <EditableField
                label="Real Price"
                value={product.realPrice}
                type="number"
                className="mx-auto w-40 mt-2  bg-gray-100  rounded-xl" // Override text color for header
                onSave={(val) => handleFieldChange("realPrice", val)}
              />
              <EditableField
                label="Currency"
                value={
                  currency.find((c) => c.code === product.currency)?.code || ""
                }
                options={currency.map((c) => c.code)}
                className="mx-auto w-40 mt-2  bg-gray-100  rounded-xl" // Override text color for header
                type="select"
                onSave={(val) =>
                  handleFieldChange(
                    "currency",
                    currency.find((c) => c.code === val)?.code || ""
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-indigo-800">Description</h2>
        <EditableField
          label="Product Description"
          value={product.description}
          type="textarea"
          onSave={(val) => handleFieldChange("description", val)}
          className=" block w-full text-gray-700 leading-relaxed"
        />
        <button className="font-extrabold text-white px-6 py-2 w-100 mt-6 bg-green-500 hover:bg-green-700 rounded-4xl">
          submit
        </button>
      </div>
    </div>
  );
}

export default ProductDetailsPage;


endpoint: apiClient.get(/catalog/products/{id}/)

data:

{
    "name": "Almond Kernels",
    "category": 1,
    "department": 1,
    "base_unit": 2,
    "reorder_level": 50,
    "description": "Unsalted premium almonds.",
    "selling_price": "20.000",
    "selling_currency": 1,
    "image_url": null,
    "available": 79.0,
    "purchased": 120.0,
    "sold": 41.0,
    "returned": 0
}

and post to this url: data format:

{
    "name": "Almond Kernels",
    "category": 1,
    "base_unit": 2,
    "reorder_level": 50,
    "description": "Unsalted premium almonds.",
    "selling_price": "20.000",
    "selling_currency": 1,
}


image posting
apiClient.post(/catalog/products/{id}/upload-image/)

logic in djago drf
@action(
        detail=True,
        methods=['post'],
        url_path='upload-image',
        parser_classes=[MultiPartParser, FormParser],
        description="Upload/replace the image for this variant"
    )
    def upload_image(self, request, pk=None):
        variant = self.get_object()
        image = request.FILES.get('image')

        if not image:
            return Response(
                {'detail': 'Image is not Provided'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Override and save
        variant.image = image
        variant.save()
        image_url = request.build_absolute_uri(variant.image.url)
        
        return Response({'image': image_url})

useDepartmentStore(s => s.departments)
department interface

export interface Department {
  id: number;
  name: string;
  description?: string;
  total_products: number;
  total_quantity: number;
  categories: Category[];
}
export interface Category {
  id: number;
  name: string;
  total_products: number;
  total_quantity: number;
  description: string;
}



hey bro

connect my fron to backend

useUnitStore(s => s.units)
unit has id, name, abbreviation

change real price to sell price in front
when choosing the department it should dynamically shows the categories of that department

submit button does not include image
image is saved to backend when changed.

use zod and react hook form for form validation
use sonner toast for success and error messages
wrap errors in extractAxiosError(error, default_message): string located in /utils/extractError

apiCLient is an axios instance and is pre configured
use react query

if you have any other question ask, before you proceed