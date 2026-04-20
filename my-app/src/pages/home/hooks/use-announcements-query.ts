import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { apiClient } from "../../../api-client";
import { DEFAULT_POSTS_PAGE_SIZE } from "../constants";

function fetchAnnouncements(
  currentPage: number,
  pageSize: number = DEFAULT_POSTS_PAGE_SIZE,
  searchTerm?: string,
) {
  return apiClient.get("/announcements", {
    params: {
      page: currentPage,
      limit: pageSize,
      search: searchTerm || undefined,
    },
  });
}

export function useAnnouncementsQuery(
  currentPage: number,
  pageSize: number = DEFAULT_POSTS_PAGE_SIZE,
  searchTerm?: string,
) {
  return useQuery({
    queryKey: ["announcements", currentPage, pageSize, searchTerm ?? ""],
    queryFn: () => fetchAnnouncements(currentPage, pageSize, searchTerm),
    placeholderData: keepPreviousData,
  });
}

type UpdateAnnouncementPayload = {
  title: string;
  body: string;
  author: string;
  pinned: boolean;
};

type CreateAnnouncementPayload = {
  title: string;
  body: string;
  author: string;
  pinned: boolean;
};

export function useUpdateAnnouncementMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateAnnouncementPayload;
    }) => apiClient.patch(`/announcements/${id}`, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}

export function useDeleteAnnouncementMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => apiClient.delete(`/announcements/${id}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}

export function useCreateAnnouncementMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateAnnouncementPayload) =>
      apiClient.post("/announcements", payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}

export function useGenerateAnnouncementsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => apiClient.post("/announcements/generate"),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}
