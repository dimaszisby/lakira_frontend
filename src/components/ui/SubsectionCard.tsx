import SubsectionHeader from "./SubsectionHeader";

/**
 * Card component for subsections, providing consistent styling.
 * @param title - Subsection title
 * @param children - Content of the subsection
 * @param className - Additional CSS classes for customization
 */
const SubsectionCard: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className = "" }) => (
  <div className={`bg-[#F4F5FB] rounded-xl p-4 ${className}`}>
    <SubsectionHeader title={title} />
    {children}
  </div>
);

export default SubsectionCard;