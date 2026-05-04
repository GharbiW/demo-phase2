import { cn } from "@/lib/cn";

/**
 * Table — platform-density data table.
 *
 * Props on Table:
 *  compact   boolean  — smaller row height (default false)
 *  stickyHeader boolean — sticky thead (wrap in overflow-y-auto container externally)
 */
export function Table({ children, compact = false, stickyHeader = false, className }) {
  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table
        className={cn(
          "w-full border-separate border-spacing-0",
          compact && "text-xs",
        )}
        data-compact={compact ? "true" : undefined}
        data-sticky={stickyHeader ? "true" : undefined}
      >
        {children}
      </table>
    </div>
  );
}

export function Thead({ children, sticky = false }) {
  return (
    <thead className={cn(sticky && "sticky top-0 z-10")}>{children}</thead>
  );
}

export function Tbody({ children }) {
  return <tbody>{children}</tbody>;
}

/**
 * Tr — table row.
 * Props:
 *  clickable  boolean   — adds hover highlight + pointer cursor
 *  onClick    function
 *  actions    ReactNode — shown on hover (absolute right slot; wrap parent in relative)
 *  highlighted boolean  — forces active highlight
 */
export function Tr({ children, className, clickable, onClick, highlighted }) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        "group border-b border-neutral-100 transition-colors last:border-0",
        clickable && "cursor-pointer hover:bg-neutral-50",
        highlighted && "bg-blue-50",
        className,
      )}
    >
      {children}
    </tr>
  );
}

export function Th({ children, className, right }) {
  return (
    <th
      className={cn(
        "text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500",
        "px-3 py-2.5 border-b border-neutral-200 bg-neutral-50 whitespace-nowrap",
        right && "text-right",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Td({ children, className, right, muted }) {
  return (
    <td
      className={cn(
        "px-3 py-2.5 text-sm whitespace-nowrap",
        muted ? "text-neutral-400" : "text-neutral-800",
        right && "text-right",
        className,
      )}
    >
      {children}
    </td>
  );
}
