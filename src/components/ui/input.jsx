import { cn } from "@/lib/utils";

function Input({ className, type = "text", ...props }) {
  return (
    <input
      data-slot="input"
      type={type}
      className={cn(
        "flex h-10 w-full min-w-0 rounded-xl border border-ui-input bg-ui-background px-3 py-2 text-sm text-ui-foreground shadow-xs outline-none transition-[border-color,box-shadow] placeholder:text-ui-muted-foreground focus-visible:border-ui-ring focus-visible:ring-[3px] focus-visible:ring-ui-ring/25 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-ui-destructive aria-invalid:ring-ui-destructive/20 file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-ui-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
