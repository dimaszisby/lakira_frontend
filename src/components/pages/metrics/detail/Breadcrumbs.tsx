import { Link } from "phosphor-react";

/**
 * Breadcrumbs navigation for the metric detail page.
 */
const Breadcrumbs: React.FC<{
  categoryName?: string;
  categoryId?: string;
  metricName: string;
}> = ({ categoryName, categoryId, metricName }) => (
  <nav
    className="w-full py-4 px-6 bg-white rounded-2xl"
    aria-label="Breadcrumb"
  >
    <ol className="flex items-center text-sm font-medium text-gray-500 space-x-2">
      <li>
        <Link href="/metrics" className="hover:underline">
          Metric Library
        </Link>
        <span className="mx-2">/</span>
      </li>
      {categoryName && categoryId && (
        <>
          <li>
            <Link href={`/category/${categoryId}`} className="hover:underline">
              {categoryName}
            </Link>
            <span className="mx-1">/</span>
          </li>
        </>
      )}
      <li className="text-[#EA5678] truncate font-semibold">{metricName}</li>
    </ol>
  </nav>
);

export default Breadcrumbs;
