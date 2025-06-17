/**
 * Section header component for consistent styling across sections.
 * @param title - Section title
 * @param action - Optional React node (button, menu, etc) to show at right
 */
const SectionHeader: React.FC<{
  title?: string;
  children?: React.ReactNode | undefined;
  className?: string;
}> = ({ title, children, className = "" }) => (
  <div className={`flex items-center justify-between mb-4${className}`}>
    {title && <h2 className="text-xl font-bold">{title}</h2>}
    {children}
  </div>
);

export default SectionHeader;
