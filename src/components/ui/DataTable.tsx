import { cn } from "@/lib/utils";

interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = "No data found.",
  className,
}: DataTableProps<T>) {
  return (
    /* Outer wrapper with horizontal scroll — key for mobile */
    <div className={cn("w-full overflow-x-auto rounded-xl border border-[#1e1e1e]", className)}>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-[#111] border-b border-[#1e1e1e]">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#888] whitespace-nowrap",
                  col.headerClassName
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-[#666]">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={keyExtractor(row)}
                className={cn(
                  "border-b border-[#1a1a1a] last:border-0 transition-colors hover:bg-white/[0.02]",
                  i % 2 === 0 ? "bg-[#0d0d0d]" : "bg-[#0a0a0a]"
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn("px-4 py-3 text-[#ddd] whitespace-nowrap", col.className)}
                  >
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
