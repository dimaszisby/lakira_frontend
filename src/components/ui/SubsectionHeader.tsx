/**
 * Subsection header component for consistent styling in subsections.
 * @param title - Subsection title
 * @param className - Additional CSS classes for customization
 */
const SubsectionHeader: React.FC<{ title: string; className?: string }> = ({
  title,
  className,
}) => (
  <div
    className={`px-4 py-2 bg-[#F7F9FC] text-lg font-medium text-[#578C9C] rounded-xl border border-[#578C9C] mb-4 ${className}`}
  >
    {title}
  </div>
);

export default SubsectionHeader;
