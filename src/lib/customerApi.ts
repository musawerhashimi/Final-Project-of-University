import type { ListCustomer, CustomerFormData, CustomerListResponse } from "../entities/Customer";
import apiClient from "./api";

export const customerApi = {
  getCustomers: async (page = 1, search = ''): Promise<CustomerListResponse> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    params.append('page', page.toString());
    
    const response = await apiClient.get(`/customers/customers/?${params}`);
    return response.data;
  },

  createCustomer: async (customerData: CustomerFormData): Promise<ListCustomer> => {
    const formData = new FormData();
    
    // Append all fields to FormData
    Object.entries(customerData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'photo' && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    const response = await apiClient.post('/customers/customers/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getCustomerById: async (id: number): Promise<ListCustomer> => {
    const response = await apiClient.get(`/customers/customers/${id}/`);
    return response.data;
  },
};