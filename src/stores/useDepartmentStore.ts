// stores/useDepartmentStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Category } from "../entities/Category";
import { type Department } from "../entities/Department";
import apiClient from "../lib/api";
import { HttpService } from "../lib/HttpService";
import { extractAxiosError } from "../utils/extractError";
import { toast } from "sonner";

interface DepartmentStore {
  departments: Department[];
  loading: boolean;
  error: string | null;

  // Actions
  setDepartments: (departments: Department[]) => void;
  addCategory: (departmentId: number, category: Category) => void;

  fetchDepartments: () => Promise<void>;
  createDepartment: (
    department: Omit<
      Department,
      "id" | "categories" | "total_products" | "total_quantity"
    >
  ) => Promise<number | undefined>;
  createCategory: (
    name: string,
    departmentId: number
  ) => Promise<number | undefined>;
  updateDepartment: (
    id: number,
    department: Partial<Department>
  ) => Promise<void>;

  deleteDepartment: (id: number) => Promise<void>;
  getItemById: (id: number) => Department;
  clearError: () => void;
}

const departmentService = new HttpService<Department>("/catalog/departments");

export const useDepartmentStore = create<DepartmentStore>()(
  devtools(
    (set, get) => ({
      departments: [],
      loading: false,
      error: null,

      setDepartments(departments) {
        set(() => ({
          departments,
        }));
      },
      fetchDepartments: async () => {
        set({ loading: true, error: null });
        try {
          const departments = await departmentService.getAll();
          set({ departments, loading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to fetch departments",
            loading: false,
          });
        }
      },

      createDepartment: async (department) => {
        set({ loading: true, error: null });
        try {
          const newDepartment = await departmentService.create(department);
          set((state) => ({
            departments: [...state.departments, newDepartment],
            loading: false,
          }));
          toast.success(`department: ${newDepartment.name} added Successfully`)
          return newDepartment.id;
        } catch (error) {
          const errorMessage = extractAxiosError(
            error,
            "Failed to create Department"
          );
          set({
            error: errorMessage,
            loading: false,
          });
          toast.error(errorMessage);
        }
      },

      async createCategory(name, departmentId) {
        const { addCategory } = get();
        try {
          const newCategory = (
            await apiClient.post<Category>("/catalog/categories/", {
              department: departmentId,
              name,
            })
          ).data;
          addCategory(departmentId, newCategory);
          toast.success(`category: ${newCategory.name} added Successfully`)
          return newCategory.id;
        } catch (error) {
          const errorMessage = extractAxiosError(
            error,
            "Failed To Create Category"
          );
          toast.error(errorMessage);
        }
      },
      addCategory(departmentId, category) {
        const { getItemById } = get();
        const department = getItemById(departmentId);
        const newDepartment: Department = {
          ...department,
          categories: [...department.categories, category],
        };
        set((state) => ({
          departments: state.departments.map((d) =>
            d.id === departmentId ? newDepartment : d
          ),
        }));
      },
      updateDepartment: async (id, updates) => {
        const { departments } = get();
        // Optimistic update
        const optimisticDepartments = departments.map((dept) =>
          dept.id === id ? { ...dept, ...updates } : dept
        );
        set({ departments: optimisticDepartments });

        try {
          const updatedDepartment = await departmentService.update(id, updates);
          set((state) => ({
            departments: state.departments.map((dept) =>
              dept.id === id ? updatedDepartment : dept
            ),
          }));
        } catch (error) {
          // Revert optimistic update
          set({ departments });
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to update department",
          });
        }
      },

      deleteDepartment: async (id) => {
        const { departments } = get();
        // Optimistic update
        const optimisticDepartments = departments.filter(
          (dept) => dept.id !== id
        );
        set({ departments: optimisticDepartments });

        try {
          await departmentService.delete(id);
        } catch (error) {
          // Revert optimistic update
          set({ departments });
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to delete department",
          });
        }
      },

      getItemById(id) {
        const { departments } = get();
        return departments.find((d) => d.id === id);
      },

      clearError: () => set({ error: null }),
    }),
    { name: "department-store" }
  )
);
