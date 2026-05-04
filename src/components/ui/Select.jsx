import { cn } from "@/lib/cn";

export function Select({ className, children, ...props }) {
  return (
    <select
      className={cn(
        "h-10 rounded-lg border border-neutral-200 bg-white px-3 pr-8 text-sm text-neutral-900",
        "focus:outline-none focus:ring-2 focus:ring-neutral-200",
        "appearance-none cursor-pointer",
        "bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNCAwNkw4IDEwTDEyIDA2IiBzdHJva2U9IiM3MzczNzMiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=')] bg-no-repeat bg-[right_0.5rem_center]",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
