import SectionHeader from "./SectionHeader";

/**
 * Card component for sections, providing consistent styling.
 * @param title - Optional section title
 * @param headerComponent - Optional React node for custom header content
 * @param children - Content of the section
 * @param className - Additional CSS classes for customization
 */
const SectionCard: React.FC<{
  title?: string;
  headerComponent?: React.ReactNode | undefined;
  children: React.ReactNode;
  className?: string;
}> = ({ title, headerComponent, children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow p-6 ${className}`}>
    <SectionHeader title={title}>{headerComponent}</SectionHeader>
    {children}
  </div>
);

export default SectionCard;
