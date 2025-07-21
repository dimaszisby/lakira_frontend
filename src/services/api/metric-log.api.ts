// utils/interactors/metric-log.api.ts

import {
  MetricLogResponseDTO,
  CreateMetricLogRequestDTO,
  UpdateMetricLogRequestDTO,
  PaginatedMetricLogListResponseDTO,
  GenerateDummyMetricLogsRequestDTO,
} from "@/types/dtos/metric-log.dto";
import api from "./api";
import ApiResponse from "@/types/generics/ApiResponse";
import { AxiosError } from "axios";
import axiosRetry from "axios-retry";
import { handleApiError } from "@/src/services/api/handleApiError";

axiosRetry(api, {
  retries: 3, // number of retries
  retryDelay: (retryCount) => {
    console.log(`retry attempt: ${retryCount}`);
    return retryCount * 1000; // time interval between retries
  },
  retryCondition: (error) => {
    // if retry condition is not specified, by default idempotent requests are retried
    return error.code === "ECONNREFUSED";
  },
});

/**
 * @file metric-log.api.ts
 * @module utils/interactors/metric-log
 * @description This module provides functions to interact with the metric log API endpoints.
 */

/**
 * Log a new metric entry
 * @param {CreateMetricLogRequestDTO} metricLog - The metric log data to create.
 * @returns {Promise<MetricLogResponseDTO>} - A promise that resolves to the created metric log entry.
 * @throws {Error} - If the API request fails.
 */
export const createMetricLog = async (
  metricLog: CreateMetricLogRequestDTO
): Promise<MetricLogResponseDTO> => {
  console.log("logMetric called with metricLog:", metricLog);
  try {
    const response = await api.post<ApiResponse<MetricLogResponseDTO>>(
      "/metric-logs",
      metricLog
    );
    console.log("logMetric response:", response.data);
    if (response.data.status !== "success" || !response.data.data) {
      throw new Error(response.data.message || "Failed to log metric entry.");
    }
    return response.data.data;
  } catch (error: unknown) {
    console.error("Error in logMetric:", error);
    if (error instanceof Error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error("Response error data:", axiosError.response.data);
        console.error("Response status:", axiosError.response.status);
      }
      console.error("AxiosError details:", error.message, error.stack);
    }
    handleApiError(error);
    throw error;
  }
};

/**
 * Fetches a list of metric log entries, optionally filtered by metricId.
 * @param {string} [metricId] - Optional ID of the metric to retrieve logs for.
 * @param {number} [page=1] - The page number for pagination.
 * @param {number} [limit=20] - The number of items per page for pagination.
 * @returns {Promise<MetricLogListResponseDTO>} - A promise that resolves to the list of metric log entries.
 * @throws {Error} - If the API request fails.
 */
export const getMetricLogs = async ({
  metricId,
  page = 1,
  limit = 20,
  startDate,
  endDate,
}: {
  metricId?: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}): Promise<PaginatedMetricLogListResponseDTO> => {
  try {
    let url = `/metric-logs?page=${page}&limit=${limit}`;
    if (metricId) {
      url += `&metricId=${metricId}`;
    }
    if (startDate && startDate.trim() !== "") {
      url += `&startDate=${startDate}`;
    }
    if (endDate && endDate.trim() !== "") {
      url += `&endDate=${endDate}`;
    }

    const { data } = await api.get<
      ApiResponse<PaginatedMetricLogListResponseDTO>
    >(url);

    if (data.status !== "success" || !data.data) {
      throw new Error(data.message || "Failed to fetch metric logs.");
    }
    return data.data;
  } catch (error: unknown) {
    console.error("Error fetching metric logs:", error);
    handleApiError(error);
    throw error;
  }
};

/**
 * Update an existing metric log entry
 * @param {string} metricLogId - The ID of the metric log entry to update.
 * @param {UpdateMetricLogRequestDTO} metricLog - The metric log data to update.
 * @returns {Promise<MetricLogResponseDTO>} - A promise that resolves to the updated metric log entry.
 * @throws {Error} - If the API request fails.
 */
export const updateMetricLog = async ({
  metricLogId,
  metricLog,
}: {
  metricLogId: string;
  metricLog: UpdateMetricLogRequestDTO;
}): Promise<MetricLogResponseDTO> => {
  try {
    const response = await api.put<ApiResponse<MetricLogResponseDTO>>(
      `/metric-logs/${metricLogId}`,
      metricLog
    );

    if (response.data.status !== "success" || !response.data.data) {
      throw new Error(
        response.data.message || "Failed to update metric log entry."
      );
    }

    return response.data.data;
  } catch (error: unknown) {
    console.error("Error in updateMetricLog:", error);
    handleApiError(error);
    throw error;
  }
};

/**
 * Delete a metric log entry
 * @param {string} metricLogId - The ID of the metric log entry to delete.
 * @returns {Promise<MetricLogResponseDTO>} - A promise that resolves to the deleted metric log entry.
 * @throws {Error} - If the API request fails.
 */
export const deleteMetricLog = async (
  metricLogId: string
): Promise<MetricLogResponseDTO> => {
  try {
    const response = await api.delete<ApiResponse<MetricLogResponseDTO>>(
      `/metric-logs/${metricLogId}`
    );

    if (response.data.status !== "success" || !response.data.data) {
      throw new Error(
        response.data.message || "Failed to delete metric log entry."
      );
    }

    return response.data.data;
  } catch (error: unknown) {
    console.error("Error in deleteMetricLog:", error);
    handleApiError(error);
    throw error;
  }
};

/**
 * * ===== API Endopoints for Testing Purposes =====
 */

export const createMetricLogDummy = async (
  metric: GenerateDummyMetricLogsRequestDTO
): Promise<{ logs: MetricLogResponseDTO[] }> => {
  console.log("createMetricLogDummy called with metric:", metric);
  try {
    const response = await api.post<
      ApiResponse<{ logs: MetricLogResponseDTO[] }>
    >(`/metric-logs/${metric.metricId}/dummy`, metric);
    console.log("createMetricLogDummy response:", response.data);
    if (response.data.status !== "success" || !response.data.data) {
      throw new Error(
        response.data.message || "Failed to generate dummy metric logs."
      );
    }
    return response.data.data;
  } catch (error: unknown) {
    console.error("Error in generating Metric Dummy:", error);
    handleApiError(error);
    throw error;
  }
};
