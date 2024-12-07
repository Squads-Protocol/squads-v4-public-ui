import { AlertTriangle } from "lucide-react";

export default function Alert({ title, description }: { title: string, description: string }) {
  return (
    <div className="rounded-md font-neue border border-yellow-500/80 bg-yellow-500/10 p-4">
      <div className="flex">
        <div className="shrink-0">
          <AlertTriangle aria-hidden="true" className="size-5 text-yellow-500/80" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-500/80">{title}</h3>
          <div className="mt-2 text-xs text-yellow-500/70">
            <p>
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
