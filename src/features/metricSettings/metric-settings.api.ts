import {
  MetricSettingsResponseDTO,
  CreateMetricSettingsRequestDTO,
  UpdateMetricSettingsRequestDTO,
  DisplayOptionsDTO,
} from "@/src/types/dtos/metric-settings.dto";
import api from "../../services/api/api";
import ApiResponse, { unwrap } from "@/src/types/generics/ApiResponse";
import { handleApiError } from "@/src/services/api/handleApiError";

/**
 * * CREATE
 * @description Create new metric settings.
 */
export const createMetricSettings = async (
  metricSettings: CreateMetricSettingsRequestDTO
): Promise<MetricSettingsResponseDTO> => {
  console.log("createMetricSettings called with:", metricSettings);
  try {
    const res = await api.post<ApiResponse<MetricSettingsResponseDTO>>(
      "/metric-settings",
      metricSettings
    );

    return unwrap(res);
  } catch (error: unknown) {
    console.error("Error in createMetricSettings:", error);
    handleApiError(error);
    throw error;
  }
};
/**
 * * GET All
 * @description Get all metric settings, optionally filtered by metricId.
 */
export const getAllMetricSettings = async (
  metricId?: string
): Promise<MetricSettingsResponseDTO[]> => {
  try {
    let url = "/metric-settings";
    if (metricId) {
      url += `?metricId=${metricId}`;
    }
    const res = await api.get<
      ApiResponse<{ settings: MetricSettingsResponseDTO[] }>
    >(url);

    return unwrap(res).settings;
  } catch (error: unknown) {
    console.error("Error fetching metric settings:", error);
    handleApiError(error);
    throw error;
  }
};

/**
 * * GET By Id
 * @description Get a specific metric settings by ID.
 */
export const getMetricSettingsById = async (
  id: string,
  metricId: string
): Promise<MetricSettingsResponseDTO> => {
  try {
    const res = await api.get<
      ApiResponse<{ settings: MetricSettingsResponseDTO }>
    >(`/metric-settings/${id}?metricId=${metricId}`);

    return unwrap(res).settings;
  } catch (error: unknown) {
    console.error("Error fetching metric settings by ID:", error);
    handleApiError(error);
    throw error;
  }
};

/**
 * * UPDATE
 * @description Update a specific metric settings by ID.
 */
export const updateMetricSettings = async (
  id: string,
  metricId: string,
  metricSettings: UpdateMetricSettingsRequestDTO
): Promise<MetricSettingsResponseDTO> => {
  console.log(
    "updateMetricSettings called with:",
    id,
    metricId,
    metricSettings
  );
  try {
    const res = await api.put<ApiResponse<MetricSettingsResponseDTO>>(
      `/metric-settings/${id}?metricId=${metricId}`,
      metricSettings
    );

    return unwrap(res);
  } catch (error: unknown) {
    console.error("Error in updateMetricSettings:", error);
    handleApiError(error);
    throw error;
  }
};

/**
 * * DELETE
 * @description Delete a specific metric settings by ID.
 */
export const deleteMetricSettings = async (
  id: string,
  metricId: string
): Promise<MetricSettingsResponseDTO> => {
  try {
    const res = await api.delete<ApiResponse<MetricSettingsResponseDTO>>(
      `/metric-settings/${id}?metricId=${metricId}`
    );

    return unwrap(res);
  } catch (error: unknown) {
    console.error("Error in deleteMetricSettings:", error);
    handleApiError(error);
    throw error;
  }
};

/**
 * * PATCH goal achievements
 * @description Update goal achievement status for metric settings.
 */
export const updateGoalAchievement = async (
  id: string,
  metricId: string
): Promise<MetricSettingsResponseDTO> => {
  try {
    const res = await api.patch<ApiResponse<MetricSettingsResponseDTO>>(
      `/metric-settings/${id}/achieve?metricId=${metricId}`
    );

    return unwrap(res);
  } catch (error: unknown) {
    console.error("Error in updateGoalAchievement:", error);
    handleApiError(error);
    throw error;
  }
};

/**
 * * PATCH display
 * @description Update display options for metric settings.
 */
export const updateDisplayOptions = async (
  id: string,
  metricId: string,
  displayOptions: DisplayOptionsDTO
): Promise<MetricSettingsResponseDTO> => {
  console.log(
    "updateDisplayOptions called with:",
    id,
    metricId,
    displayOptions
  );
  try {
    const res = await api.patch<ApiResponse<MetricSettingsResponseDTO>>(
      `/metric-settings/${id}/display?metricId=${metricId}`,
      { displayOptions }
    );

    return unwrap(res);
  } catch (error: unknown) {
    console.error("Error in updateDisplayOptions:", error);
    handleApiError(error);
    throw error;
  }
};
