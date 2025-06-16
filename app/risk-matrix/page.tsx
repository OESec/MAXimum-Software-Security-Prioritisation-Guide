import { RiskMatrix } from "@/components/risk-matrix"

export default function RiskMatrixPage() {
  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-primary-foreground rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-primary rounded-full" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold">Risk Matrix</h1>
        </div>
        <RiskMatrix />
      </div>
    </div>
  )
}
