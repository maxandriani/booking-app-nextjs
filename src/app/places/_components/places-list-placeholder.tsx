import { Skeleton } from "@/components/ui/skeleton";

export default function PlacesListPLaceholder() {
  return (
    <div className="flex w-full flex-col gap-6">
      {[1, 2, 3, 4, 5].map(k => (
        <div key={k} className="flex flex-col flex-1 gap-2">
          <Skeleton className="h-4 w-full" />
          <span className="flex w-full gap-6">
            <span className="flex-1 min-w-0 max-w-40">
              <Skeleton className="h-4 w-full" />
            </span>

            <span className="flex-1 min-w-0 max-w-40">
              <Skeleton className="h-4 w-full" />
            </span>

            <span className="flex-1 min-w-0 max-w-40">
              <Skeleton className="h-4 w-full" />
            </span>
          </span>
        </div>
      ))}
    </div>
  )
}