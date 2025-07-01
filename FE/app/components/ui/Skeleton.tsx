import { cn } from "@/app/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-[0.625rem] bg-gray-100 dark:bg-gray-800", className)}
      {...props}
    />
  )
}

export { Skeleton }
