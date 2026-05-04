import { cn } from "@/lib/cn";

export function Skeleton({ className }) {
  return (
    <div className={cn("animate-pulse rounded bg-neutral-200", className)} />
  );
}

export function TableSkeleton({ rows = 6, cols = 5 }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-separate border-spacing-0">
        <thead>
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="px-3 py-2 border-b border-neutral-200 bg-neutral-50">
                <Skeleton className="h-3 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>
              {Array.from({ length: cols }).map((_, c) => (
                <td key={c} className="px-3 py-2.5 border-b border-neutral-100">
                  <Skeleton className={cn("h-3", c === 0 ? "w-32" : "w-16")} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 space-y-3">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-7 w-24" />
      <Skeleton className="h-3 w-40" />
    </div>
  );
}
