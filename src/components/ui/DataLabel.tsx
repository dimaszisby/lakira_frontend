import OverlineLabel from "./OverlineLabel";

/**
 * Data label component for displaying key-value pairs.
 * @param label - The label for the data point
 * @param value - The value to display
 */
export const DataLabel: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="flex flex-col">
    <OverlineLabel text={label} />
    <span className="text-gray-700 font-mono text-base">{value}</span>
  </div>
);
