import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"

function Checkbox({
  className,
  ...props
}: any) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-5 shrink-0 items-center justify-center rounded-[4px] border-2 border-foreground bg-card shadow-brutal-sm transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 group-has-disabled/field:opacity-50 group-has-[:focus-visible]/field-label:ring-0 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-card dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-foreground data-checked:bg-accent data-checked:text-accent-foreground group-has-[:focus-visible]/field-label:data-checked:border-foreground",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
      >
        <CheckIcon
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
