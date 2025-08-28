export default function ListModeToggle({
  value,
  onChange,
}: {
  value: "pages" | "scroll";
  onChange: (v: "pages" | "scroll") => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        className={`px-2 py-1 rounded ${
          value === "pages" ? "bg-gray-200" : ""
        }`}
        onClick={() => onChange("pages")}
        aria-pressed={value === "pages"}
      >
        Pages
      </button>
      <button
        className={`px-2 py-1 rounded ${
          value === "scroll" ? "bg-gray-200" : ""
        }`}
        onClick={() => onChange("scroll")}
        aria-pressed={value === "scroll"}
      >
        Infinite
      </button>
    </div>
  );
}
