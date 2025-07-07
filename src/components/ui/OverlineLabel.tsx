/**
 * Standalone Overline title component for metric details data.
 * @param text - The text to display as an overline label
 */
const OverlineLabel: React.FC<{ text: string }> = ({ text }) => (
  <span className="uppercase text-xs text-[#578C9C] font-semibold mb-1">
    {text}
  </span>
);

export default OverlineLabel;
