// hooks/useUser.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { userApi } from "../lib/userApi";
import type { UpdateUserData, UserProfile } from "../stores/useUserStore";
import { extractAxiosError } from "../utils/extractError";
import type { Permission } from "../data/permissions";

export const useUser = (id: number | "me", options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => userApi.getUser(id).then((res) => res.data),
    ...options,
  });
};

export const useUpdateUser = (id: number | "me", options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserData) =>
      userApi.updateUser(id, data).then((res) => res.data),
    onSuccess: () => {
      toast.success("User updated Successfully");
      queryClient.invalidateQueries({ queryKey: ["user", id] });
    },
    onError: (error) => {
      toast.error(extractAxiosError(error));
    },
    ...options,
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => userApi.deleteUser(id),
    onSuccess: () => {
      toast.success("User deleted Successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error(extractAxiosError(error, "Failed to Delete User"));
    },
  });
};

export const useUploadUserPhotoMutation = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => userApi.uploadUserPhoto(userId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      toast.success("Successfully uploaded photo!");
    },
    onError: (error: unknown) => {
      const msg = extractAxiosError(error);
      toast.error(msg);
    },
  });
};

export const useDeleteUserPhotoMutation = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => userApi.deleteUserPhoto(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      toast.success("Photo deleted");
    },
    onError: (error: unknown) => {
      toast.error(extractAxiosError(error, "Could not delete photo"));
    },
  });
};
export const useUpdateUserPermissions = (userId?: number) => {
  const queryClient = useQueryClient();
  const update = (permissions: Permission[]) => {
    if (!userId) return;
    queryClient.setQueryData(
      ["user", userId],
      (oldData?: UserProfile): UserProfile | undefined => {
        if (!oldData) return;
        return {
          ...oldData,
          permissions,
        };
      }
    );
  };
  return { update };
};
