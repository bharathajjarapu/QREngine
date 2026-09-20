import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({
  className,
  ...props
}: any) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-md border-2 border-foreground bg-card px-2.5 py-2 text-base shadow-brutal-sm transition-all outline-none placeholder:text-muted-foreground focus-visible:-translate-y-px focus-visible:border-ring focus-visible:shadow-brutal focus-visible:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 disabled:shadow-none aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-card dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
