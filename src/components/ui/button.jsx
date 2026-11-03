import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-[color,background-color,border-color,box-shadow] outline-none focus-visible:border-ui-ring focus-visible:ring-[3px] focus-visible:ring-ui-ring/35 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-ui-primary text-ui-primary-foreground shadow-sm hover:bg-ui-primary/90",
        destructive: "bg-ui-destructive text-ui-destructive-foreground shadow-sm hover:bg-ui-destructive/90 focus-visible:ring-ui-destructive/30",
        outline: "border border-ui-border bg-ui-background text-ui-foreground shadow-xs hover:bg-ui-accent hover:text-ui-accent-foreground",
        secondary: "bg-ui-secondary text-ui-secondary-foreground hover:bg-ui-secondary/80",
        ghost: "text-ui-muted-foreground hover:bg-ui-accent hover:text-ui-accent-foreground",
        link: "text-ui-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 gap-1.5 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-6",
        icon: "size-10",
        "icon-sm": "size-9 rounded-lg",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

function Button({ className, variant, size, asChild = false, type = "button", ...props }) {
  const Component = asChild ? Slot : "button";
  return (
    <Component
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...(!asChild ? { type } : {})}
      {...props}
    />
  );
}

export { Button, buttonVariants };
