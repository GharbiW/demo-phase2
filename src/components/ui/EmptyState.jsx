import { cn } from "@/lib/cn";

export function EmptyState({ icon, title, description, action, className }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-8 text-center",
        className,
      )}
    >
      {icon ? (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
          {icon}
        </div>
      ) : null}
      <p className="text-sm font-semibold text-neutral-700">{title}</p>
      {description ? (
        <p className="mt-1 text-sm text-neutral-400 max-w-xs">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
