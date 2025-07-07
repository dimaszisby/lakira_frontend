// components/metrics/MetricDetailCard.tsx

"use client";

import { MetricDomainExtended } from "@/src/types/domain/metric.domain";
import { Pencil } from "phosphor-react";

export default function MetricDetailCard({
  metric,
  onEdit,
}: {
  metric: MetricDomainExtended;
  onEdit: () => void;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md relative">
      <h3 className="text-xl font-bold mb-2">Metric Detail</h3>
      <p className="text-sm text-gray-500 mb-4">
        {metric.description || "No description provided."}
      </p>
      <div className="text-sm">
        <p>
          <strong>Unit:</strong> {metric.defaultUnit}
        </p>
        <p>
          <strong>Visibility:</strong> {metric.isPublic ? "Public" : "Private"}
        </p>
        {metric.category && (
          <p>
            <strong>Category:</strong> {metric.category.icon}{" "}
            {metric.category.name}
          </p>
        )}
      </div>
      <button
        onClick={onEdit}
        className="absolute top-4 right-4 text-gray-500 hover:text-blue-600"
      >
        <Pencil size={20} />
      </button>
    </div>
  );
}
