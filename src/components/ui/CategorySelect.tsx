"use client";

import * as React from "react";
import {
  Combobox,
  ComboboxPopover,
  ComboboxItem,
  useComboboxStore,
} from "@ariakit/react";
import clsx from "clsx";
import { useCreateMetricCategory } from "@/src/features/metricCategories/hooks";
import {
  CategoryOption,
  useCategoryTypeahead,
} from "@/src/features/metricCategories/useCategoryTypehead";

type Props = {
  value?: string;
  onChange: (id: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  selectedOptionHint?: Partial<CategoryOption>;
  label?: string;
};

export default function CategorySelect({
  value,
  onChange,
  placeholder = "Search category…",
  disabled,
  selectedOptionHint,
  label = "Category",
}: Props) {
  const [query, setQuery] = React.useState("");
  const store = useComboboxStore({ open: false });
  const { options, isLoading, isFetching, hasNextPage, fetchNextPage } =
    useCategoryTypeahead(query);

  const selected =
    options.find((o) => o.value === value) ??
    (value && selectedOptionHint?.label
      ? {
          value,
          label: selectedOptionHint.label,
          color: selectedOptionHint.color ?? "#EDEDED",
          icon: selectedOptionHint.icon ?? "📁",
          metricCount: selectedOptionHint.metricCount ?? 0,
        }
      : undefined);

  // Inline create
  const { createMetricCategory, isPending: isCreating } =
    useCreateMetricCategory();

  const createNew = async (name: string) => {
    if (!name.trim()) return;
    const created = await createMetricCategory({
      name: name.trim(),
      color: "#E897A3",
      icon: "📁",
    });
    onChange(created.id);
    setQuery("");
    store.setOpen(false);
  };

  const showCreate =
    query.trim().length >= 2 &&
    !options.some((o) => o.label.toLowerCase() === query.trim().toLowerCase());

  // Infinite scroll on popover
  const listRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const onScroll = () => {
      if (
        hasNextPage &&
        el.scrollTop + el.clientHeight >= el.scrollHeight - 96
      ) {
        fetchNextPage();
      }
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [hasNextPage, fetchNextPage]);

  return (
    <div className="w-full">
      <label className="block text-sm text-gray-600 mb-1">{label}</label>

      {/* Trigger is just the input itself (combobox) */}
      <Combobox
        store={store}
        value={selected ? selected.label : query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={selected ? selected.label : placeholder}
        disabled={disabled}
        aria-autocomplete="list"
        className={clsx(
          "w-full rounded-xl border bg-white px-3 py-2 outline-none",
          disabled && "bg-gray-50 text-gray-400 cursor-not-allowed"
        )}
        onFocus={() => store.setOpen(true)}
      />

      <ComboboxPopover
        store={store}
        gutter={8}
        sameWidth
        className="z-50 mt-2 w-full rounded-xl border bg-white shadow-lg"
      >
        <div ref={listRef} className="max-h-64 overflow-auto">
          {isLoading && (
            <div className="px-3 py-2 text-sm text-gray-500">Loading…</div>
          )}

          {!isLoading &&
            options.map((opt) => (
              <ComboboxItem
                key={opt.value}
                value={opt.label}
                className="px-3 py-2 flex items-center gap-2 cursor-pointer aria-selected:bg-gray-100 hover:bg-gray-50"
                setValueOnClick={false}
                onClick={() => {
                  onChange(opt.value);

                  setQuery("");
                  store.setOpen(false);
                }}
              >
                <span className="text-lg">{opt.icon}</span>
                <span
                  className="inline-block w-3 h-3 rounded-sm"
                  style={{ backgroundColor: opt.color }}
                />
                <span className="flex-1 truncate">{opt.label}</span>
                <span className="text-xs text-gray-500">{opt.metricCount}</span>
              </ComboboxItem>
            ))}

          {!isLoading && options.length === 0 && !showCreate && (
            <div className="px-3 py-2 text-sm text-gray-500">
              No categories found
            </div>
          )}

          {showCreate && (
            <button
              type="button"
              className="w-full text-left px-3 py-2 border-t bg-white hover:bg-gray-50"
              onClick={() => createNew(query)}
              disabled={isCreating}
            >
              {isCreating ? "Creating…" : `Create "${query.trim()}"`}
            </button>
          )}

          {isFetching && !isLoading && (
            <div className="px-3 py-2 text-xs text-gray-400">Loading more…</div>
          )}
        </div>
      </ComboboxPopover>

      {!!value && (
        <button
          type="button"
          className="mt-1 text-xs text-gray-500 hover:text-gray-700"
          onClick={() => onChange(undefined)}
        >
          Clear
        </button>
      )}
    </div>
  );
}
