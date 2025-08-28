import { NavigationProps } from "./type";
import Link from "next/link";

const BottomNavigationBar: React.FC<NavigationProps> = ({
  navItems,
  pathname,
  onClick,
  className,
  style,
}) => {
  return (
    <nav
      className={`block fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 rounded-t-2xl ${className}`}
      style={style}
      aria-label="Bottom Navigation Bar"
    >
      <ul className="flex justify-between">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onClick}
              className={`group block flex-row px-4 py-2 place-items-center rounded-lg transition text-xs font-semibold ${
                pathname === item.href
                  ? "text-pink-500"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <item.icon size={20} className="mr-2" />
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
export default BottomNavigationBar;
