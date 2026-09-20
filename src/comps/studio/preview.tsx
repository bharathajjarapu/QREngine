import { QrCode, TriangleAlert } from 'lucide-react'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia } from '@/comps/ui/empty'
import { cn } from '@/lib/utils'

interface PreviewProps {
  svg: string
  hasError: boolean
  isStale: boolean
  errorMessage: string | null
}

// QR stage; sizes the code to the biggest square that fits the well.
export function Preview({ svg, hasError, isStale, errorMessage }: PreviewProps) {
  const ariaLabel = svg ? 'QR code preview' : hasError || errorMessage ? 'QR code needs attention' : 'QR code preview, empty'
  return (
    <div className="flex w-full min-w-0 flex-col gap-3 lg:min-h-0 lg:flex-1">
      {/* Flexible stage: container queries let the code fill leftover height. */}
      <div
        aria-live="polite"
        role="img"
        aria-label={ariaLabel}
        className="paper-well flex aspect-square max-h-full w-full min-h-0 items-center justify-center overflow-hidden rounded-md border-2 border-foreground bg-card p-5 sm:p-6 lg:aspect-auto lg:flex-1 lg:[container-type:size]"
      >
        {svg ? (
          <div
            aria-hidden
            /* Dims while the debounced payload catches up; avoids grid flash. */
            className={cn(
              'aspect-square max-h-full w-full max-w-full transition-opacity duration-200 [&>svg]:block [&>svg]:size-full [&>svg]:rounded-[4px] [&>svg]:shadow-brutal-sm',
              'lg:aspect-auto lg:size-[min(100cqw,100cqh)]',
              isStale ? 'opacity-50' : 'opacity-100'
            )}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : hasError ? (
          <Empty className="border-0 bg-transparent p-0 text-center">
            <EmptyHeader>
              <EmptyMedia variant="icon" className="bg-destructive/10 text-destructive">
                <QrCode aria-hidden />
              </EmptyMedia>
              <EmptyDescription className="text-destructive">
                Too much content for a scannable code. Shorten the text or drop a few fields.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : errorMessage ? (
          <Empty className="border-0 bg-transparent p-0 text-center">
            <EmptyHeader>
              <EmptyMedia variant="icon" className="border-2 border-foreground bg-accent text-accent-foreground shadow-brutal-sm">
                <TriangleAlert aria-hidden />
              </EmptyMedia>
              <EmptyDescription>
                <span className="font-heading text-xl font-bold text-foreground">{errorMessage}</span>
                <span className="mt-1 block">Fill the highlighted field to preview.</span>
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Empty className="border-0 bg-transparent p-0 text-center">
            <EmptyHeader>
              <EmptyMedia variant="icon" className="text-muted-foreground">
                <QrCode aria-hidden />
              </EmptyMedia>
              <EmptyDescription>
                <span className="text-xl text-foreground">Your code lands here</span>
                <span className="mt-1 block">as you type.</span>
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>
    </div>
  )
}
