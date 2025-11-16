import { Loader2Icon } from "lucide-react";

export default function AppBlockLoading() {
  return (
    <section className="flex w-full h-full items-center justify-center bg-black/25">
      <div className="flex flex-1 w-6 h-6">
        <Loader2Icon className="animate-spin" />
      </div>
    </section>
  )
}