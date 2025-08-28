import {
  CreateMetricCategoryRequestDTO,
  GenerateDummyMetricCategoriesRequestDTO,
  MetricCategoryResponseDTO,
  PaginatedMetricCategoryListResponseDTO,
  UpdateMetricCategoryRequestDTO,
} from "@/src/types/dtos/metric-category.dto";
import ApiResponse, { unwrap } from "@/src/types/generics/ApiResponse";
import api from "../../services/api/api";
import { AxiosError } from "axios";
import {
  MetricCategoryCursorPage,
  MetricCategoryFilter,
  MetricCategorySort,
} from "./sort";

// Developer Note: Should this replaced with generics?
export type ListCategoryParams = {
  limit?: number; // default 50
  sort?: MetricCategorySort;
  q?: string;
  filter?: MetricCategoryFilter;
  after?: string;
  includeTotal?: boolean;
};

// * ========== Queries ==========

/**
 * * GET List via Cursor
 * @description Fetches the list of metric categories from the API.
 */
export async function listMetricCategories({
  limit = 20,
  sort = "-createdAt",
  q,
  filter,
  after,
  includeTotal = false,
}: ListCategoryParams): Promise<MetricCategoryCursorPage> {
  const search = new URLSearchParams();

  search.set("limit", String(limit));
  search.set("sort", sort);

  if (q?.trim()) search.set("q", q.trim());
  if (filter?.name?.trim()) search.set("filter[name]", filter.name.trim());
  if (after) search.set("after", after);
  if (includeTotal) search.set("includeTotal", "true");

  const res = await api.get<ApiResponse<MetricCategoryCursorPage>>(
    `/metric-categories?${search.toString()}`
  );

  return unwrap(res);
}

/**
 * Fetches the list of metric categories from the API.
 * @deprecated currently not being used, migrating to cursor method
 */
export const getMetricCategoryLibraries = async ({
  page = 1,
  limit = 20,
  sortBy = "createdAt", // default
  sortOrder = "DESC", // default
}: {
  metricId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC" | null;
}): Promise<PaginatedMetricCategoryListResponseDTO> => {
  try {
    let url = `/metric-categories?page=${page}&limit=${limit}`;

    if (sortBy) {
      url += `&sortBy=${sortBy}`;
    }
    if (sortOrder) {
      url += `&sortOrder=${sortOrder}`;
    }

    const res = await api.get<
      ApiResponse<PaginatedMetricCategoryListResponseDTO>
    >(url);

    return unwrap(res);
  } catch (error: unknown) {
    console.error("Error fetching metric library list:", error);
    throw error;
  }
};

/**
 * * GET by ID
 * @description Fetches a single metric category by its ID.
 */
export const getMetricCategoryById = async (
  id: string
): Promise<MetricCategoryResponseDTO> => {
  try {
    const res = await api.get<ApiResponse<MetricCategoryResponseDTO>>(
      `/metric-categories/${id}`
    );

    return unwrap(res);
  } catch (error: unknown) {
    console.error(`Error fetching metric category with ID ${id}:`, error);
    throw error;
  }
};

// * ========== Mutations ==========

/**
 * * CREATE
 * @description Fetches the list of metric categories from the API.
 */
export const createMetricCategory = async (
  category: CreateMetricCategoryRequestDTO
): Promise<MetricCategoryResponseDTO> => {
  console.log("createMetric called with category:", category);
  try {
    const res = await api.post<ApiResponse<MetricCategoryResponseDTO>>(
      "/metric-categories",
      category
    );

    return unwrap(res);
  } catch (error: unknown) {
    console.error("Error in createMetric:", error);
    if (error instanceof Error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error("Response error data:", axiosError.response.data);
        console.error("Response status:", axiosError.response.status);
      }
    }
    throw error;
  }
};

/**
 * * UPDATE
 * @description Updates an existing metric category by its ID.
 */
export const updateMetricCategory = async ({
  categoryId,
  category,
}: {
  categoryId: string;
  category: UpdateMetricCategoryRequestDTO;
}): Promise<MetricCategoryResponseDTO> => {
  try {
    const res = await api.patch<ApiResponse<MetricCategoryResponseDTO>>(
      `/metric-categories/${categoryId}`,
      category
    );

    return unwrap(res);
  } catch (error: unknown) {
    console.error(
      `Error updating metric category with ID ${categoryId}:`,
      error
    );
    throw error;
  }
};

/**
 * * DELETE
 * @description a metric category by its ID.
 */
export const deleteMetricCategory = async (id: string): Promise<void> => {
  try {
    await api.delete(`/metric-categories/${id}`);
  } catch (error: unknown) {
    console.error(`Error deleting metric category with ID ${id}:`, error);
    throw error;
  }
};

/**
 * * ===== API Endopoints for Testing Purposes =====
 */

export const createMetricCategoryDummy = async (
  category: GenerateDummyMetricCategoriesRequestDTO
): Promise<{ categories: MetricCategoryResponseDTO[] }> => {
  console.log("createMetricCategoryDummy called with category:", category);
  try {
    const res = await api.post<
      ApiResponse<{ categories: MetricCategoryResponseDTO[] }>
    >("/metric-categories/dummy", category);

    return unwrap(res) ?? { categories: [] };
  } catch (error: unknown) {
    console.error("Error in generating Metric Dummy:", error);
    throw error;
  }
};
