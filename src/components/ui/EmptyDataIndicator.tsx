import React from "react";
import { Files } from "phosphor-react";

interface EmptyDataIndicatorProps {
  title: string;
  description: string;
  tooltip?: string;
}

const EmptyDataIndicator = ({
  title,
  description,
  tooltip,
}: EmptyDataIndicatorProps) => {
  return (
    <div className="text-center text-gray-600 mt-8">
      <div
        className="flex flex-col items-center justify-center max-w-md mx-auto space-y-6"
        aria-label="Empty State Container"
        role="region"
      >
        {/* Card */}
        <div
          className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg p-8 w-full max-w-xs min-h-[320px] space-y-4"
          aria-label="Empty State Card"
          role="banner"
        >
          <Files size={48} />
          <h2 className="text-gray-800 font-semibold text-xl text-center">
            {title || "No Data Available"}
          </h2>
          <p className="text-gray-500 text-base text-center">
            {description || "You haven't created any data yet."}
          </p>
        </div>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="flex items-center bg-status-info text-white px-4 py-2 rounded-xl text-sm text-center wraps"
            aria-label="Tooltip"
            role="tooltip"
          >
            <span>{tooltip || "Create your first data"}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyDataIndicator;
