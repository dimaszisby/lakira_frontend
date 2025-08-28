import { UserMetricDetailResponseDTO } from "@/features/metrics/metric.dto";
import { isChartType, MetricHeaderVM, MetricSettingsVM } from "./view-models";

// MetricHeader section of MetricDetailsPage
export function toMetricHeaderVM(
  dto: UserMetricDetailResponseDTO
): MetricHeaderVM {
  const cat = dto.category;
  return {
    id: dto.id,
    name: dto.name,
    defaultUnit: dto.defaultUnit,
    isPublic: dto.isPublic,
    description: dto.description ?? null,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    category: cat
      ? { id: cat.id, name: cat.name, color: cat.color, icon: cat.icon }
      : null,
  };
}
// MetricSetting section of MetricDetailsPage
export function toMetricSettingsVM(
  d: UserMetricDetailResponseDTO
): MetricSettingsVM {
  const s = d.settings;
  if (!s) {
    return {
      id: null,
      isActive: null,
      goalType: null,
      goalValue: null,
      startDate: null,
      deadlineDate: null,
      alertEnabled: null,
      alertThresholds: null,
      display: null,
    };
  }

  const disp = s.displayOptions
    ? {
        showOnDashboard: s.displayOptions.showOnDashboard ?? null,
        priority: s.displayOptions.priority ?? null,
        chartType: isChartType(s.displayOptions.chartType)
          ? s.displayOptions.chartType
          : null,
        color: s.displayOptions.color ?? null,
      }
    : null;

  return {
    id: s.id ?? null,
    isActive: s.isActive ?? null,
    goalType: s.goalType ?? null,
    goalValue: s.goalValue ?? null,
    startDate: s.startDate ?? null,
    deadlineDate: s.deadlineDate ?? null,
    alertEnabled: s.alertEnabled ?? null,
    alertThresholds: s.alertThresholds ?? null,
    display: disp,
  };
}

// export function toMetricSettingsVM(
//   settings?: MetricSettingsResponseDTO | null
// ): MetricSettingsVM {
//   if (!settings) {
//     // not included or not configured
//     return {
//       id: null,
//       isActive: null,
//       goalType: null,
//       goalValue: null,
//       startDate: null,
//       deadlineDate: null,
//       alertThresholds: null,
//       display: null,
//     };
//   }

//   // normalize nested display
//   const d = settings.displayOptions;
//   const display: DisplayVM = {
//     showOnDashboard: d?.showOnDashboard ?? DEFAULT_DISPLAY.showOnDashboard,
//     priority: d?.priority ?? DEFAULT_DISPLAY.priority,
//     chartType: isChartType(d?.chartType)
//       ? d!.chartType
//       : DEFAULT_DISPLAY.chartType,
//     color: d?.color ?? DEFAULT_DISPLAY.color,
//   };

//   return {
//     id: settings.id,
//     isActive: settings.isActive,
//     goalType: settings.goalEnabled ? settings.goalType ?? null : null,
//     goalValue: settings.goalEnabled ? settings.goalValue ?? null : null,
//     startDate: settings.timeFrameEnabled ? settings.startDate ?? null : null,
//     deadlineDate: settings.timeFrameEnabled
//       ? settings.deadlineDate ?? null
//       : null,
//     alertThresholds: settings.alertEnabled
//       ? settings.alertThresholds ?? null
//       : null,
//     display,
//   };
// }
