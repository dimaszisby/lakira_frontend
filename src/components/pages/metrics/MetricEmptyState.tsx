import React from "react";
import PrimaryButton from "@/src/components/ui/PrimaryButton"; // Import the PrimaryButton component
import EmptyStateCard from "@/src/components/ui/EmptyStateCard";

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
      <EmptyStateCard
        titleText="No Metrics Found"
        descriptionText="You haven't created any metrics yet."
      />

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
