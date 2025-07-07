import { Files } from "phosphor-react";

interface EmptyStateCardProps {
  titleText: string;
  descriptionText: string;
  tooltipText?: string;
}

const EmptyStateCard: React.FC<EmptyStateCardProps> = ({
  titleText,
  descriptionText,
  tooltipText,
}) => {
  return (
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
          {titleText}
        </h2>
        <p className="text-gray-500 text-base text-center">{descriptionText}</p>
      </div>

      {/* Tooltip */}
      <div
        className="flex items-center bg-status-info text-white px-4 py-2 rounded-xl text-sm text-center wraps"
        aria-label="Tooltip"
        role="tooltip"
      >
        <span>{tooltipText}</span>
      </div>
    </div>
  );
};

export default EmptyStateCard;
