import React from "react";
import PrimaryButton from "@/components/ui/PrimaryButton"; // Import the PrimaryButton component

/**
 * Props for the MetricEmptyState component.
 */
interface MetricEmptyStateProps {
  /**
   * Function to call when the "Create Your First Metric" button is clicked.
   */
  onOpenModal: () => void;
}

/**
 * A component that displays a message when the user has no metrics yet.
 */
const MetricEmptyState: React.FC<MetricEmptyStateProps> = ({ onOpenModal }) => {
  return (
    <div className="text-center text-gray-600 mt-8">
      <p className="text-xl font-medium">You have no metrics yet.</p>
      <p className="text-sm text-gray-500 mt-2">
        Start tracking your progress by adding a new metric.
      </p>
      <PrimaryButton
        onClick={onOpenModal}
        ariaLabel="Create Your First Metric"
        className="mt-4"
      >
        ➕ Create Your First Metric
      </PrimaryButton>
    </div>
  );
};

export default MetricEmptyState;
