"use client"

import { useState, useMemo } from "react"
import { useStore } from "@/lib/store"
import { RiskTrendsChart } from "@/components/risk-trends-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, RefreshCw } from "lucide-react"

interface MatrixPoint {
  id: string
  name: string
  score: number
  recommendation: string
  platformType: string
  requestor: string
  requestDate: string
  x: number
  y: number
}

export function RiskMatrix() {
  const { appRequests, platformTypes } = useStore()
  const [selectedPlatformType, setSelectedPlatformType] = useState<string>("all")
  const [selectedRecommendation, setSelectedRecommendation] = useState<string>("all")

  // Filter completed evaluations
  const completedEvaluations = appRequests.filter((request) => request.calculationResult)

  // Create matrix points
  const matrixPoints = useMemo(() => {
    let filtered = completedEvaluations

    if (selectedPlatformType !== "all") {
      filtered = filtered.filter((request) => request.platformTypeId === selectedPlatformType)
    }

    if (selectedRecommendation !== "all") {
      filtered = filtered.filter((request) => request.calculationResult?.recommendation === selectedRecommendation)
    }

    return filtered.map((request): MatrixPoint => {
      const result = request.calculationResult!
      const score = result.totalScore

      // Calculate risk level (inverse of score) for Y-axis
      const riskLevel = 100 - score

      // Calculate business impact based on platform type and criteria
      let businessImpact = 50 // Default medium impact

      // Adjust business impact based on platform type
      if (request.platformTypeId) {
        const platformType = platformTypes.find((pt) => pt.id === request.platformTypeId)
        if (platformType?.name === "SaaS") {
          businessImpact = 70 // Higher impact for SaaS
        } else if (platformType?.name === "OAuth") {
          businessImpact = 60 // Medium-high impact for OAuth
        } else if (platformType?.name === "Locally Installed") {
          businessImpact = 40 // Lower impact for local apps
        }
      }

      // Add some variation based on score to spread points
      const variation = (Math.random() - 0.5) * 10
      businessImpact += variation

      return {
        id: request.id,
        name: request.name,
        score,
        recommendation: result.recommendation,
        platformType: platformTypes.find((pt) => pt.id === request.platformTypeId)?.name || "Unknown",
        requestor: request.requestor,
        requestDate: new Date(request.requestDate).toLocaleDateString(),
        x: riskLevel, // Risk level (0-100, where 100 is highest risk)
        y: Math.max(0, Math.min(100, businessImpact)), // Business impact (0-100)
      }
    })
  }, [completedEvaluations, selectedPlatformType, selectedRecommendation, platformTypes])

  const getPointColor = (recommendation: string): string => {
    switch (recommendation) {
      case "Approve":
        return "#22c55e" // Green
      case "Approve with conditions":
        return "#f59e0b" // Orange
      case "Reject":
        return "#ef4444" // Red
      default:
        return "#6b7280" // Gray
    }
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <Tabs defaultValue="matrix" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="matrix">Risk Matrix</TabsTrigger>
            <TabsTrigger value="trends">Risk Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="matrix" className="space-y-6">
            {/* Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Matrix Visualization</CardTitle>
                <CardDescription>
                  Visual representation of all security evaluations plotted by risk level and business impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <label htmlFor="platform-filter" className="text-sm font-medium">
                      Platform Type:
                    </label>
                    <Select value={selectedPlatformType} onValueChange={setSelectedPlatformType}>
                      <SelectTrigger id="platform-filter" className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Platforms</SelectItem>
                        {platformTypes.map((platform) => (
                          <SelectItem key={platform.id} value={platform.id}>
                            {platform.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <label htmlFor="recommendation-filter" className="text-sm font-medium">
                      Recommendation:
                    </label>
                    <Select value={selectedRecommendation} onValueChange={setSelectedRecommendation}>
                      <SelectTrigger id="recommendation-filter" className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Recommendations</SelectItem>
                        <SelectItem value="Approve">Approve</SelectItem>
                        <SelectItem value="Approve with conditions">Approve with conditions</SelectItem>
                        <SelectItem value="Reject">Reject</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedPlatformType("all")
                      setSelectedRecommendation("all")
                    }}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset Filters
                  </Button>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">Approve</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-sm">Approve with conditions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm">Reject</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Matrix Visualization */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Matrix ({matrixPoints.length} evaluations)</CardTitle>
                <CardDescription>
                  X-axis: Risk Level (higher = more risk) • Y-axis: Business Impact (higher = more impact)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {matrixPoints.length > 0 ? (
                  <div className="relative">
                    {/* SVG Matrix */}
                    <svg width="100%" height="500" viewBox="0 0 600 500" className="border rounded-lg bg-background">
                      {/* Background grid and risk zones */}
                      <defs>
                        <pattern id="grid" width="60" height="50" patternUnits="userSpaceOnUse">
                          <path
                            d="M 60 0 L 0 0 0 50"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="0.5"
                            opacity="0.3"
                          />
                        </pattern>
                      </defs>

                      {/* Grid background */}
                      <rect width="500" height="400" x="80" y="50" fill="url(#grid)" />

                      {/* Risk zones */}
                      <rect x="80" y="50" width="167" height="133" fill="rgba(34, 197, 94, 0.1)" />
                      <rect x="247" y="50" width="166" height="133" fill="rgba(245, 158, 11, 0.1)" />
                      <rect x="413" y="50" width="167" height="133" fill="rgba(239, 68, 68, 0.1)" />
                      <rect x="80" y="183" width="167" height="134" fill="rgba(245, 158, 11, 0.1)" />
                      <rect x="247" y="183" width="166" height="134" fill="rgba(239, 68, 68, 0.1)" />
                      <rect x="413" y="183" width="167" height="134" fill="rgba(239, 68, 68, 0.1)" />
                      <rect x="80" y="317" width="167" height="133" fill="rgba(239, 68, 68, 0.1)" />
                      <rect x="247" y="317" width="166" height="133" fill="rgba(239, 68, 68, 0.1)" />
                      <rect x="413" y="317" width="167" height="133" fill="rgba(239, 68, 68, 0.1)" />

                      {/* Zone labels */}
                      <text x="163" y="120" textAnchor="middle" className="text-xs fill-current opacity-60">
                        Low Risk
                      </text>
                      <text x="330" y="120" textAnchor="middle" className="text-xs fill-current opacity-60">
                        Medium Risk
                      </text>
                      <text x="496" y="120" textAnchor="middle" className="text-xs fill-current opacity-60">
                        High Risk
                      </text>

                      {/* Axes */}
                      <line x1="80" y1="450" x2="580" y2="450" stroke="currentColor" strokeWidth="2" />
                      <line x1="80" y1="50" x2="80" y2="450" stroke="currentColor" strokeWidth="2" />

                      {/* X-axis labels */}
                      <text x="80" y="470" textAnchor="middle" className="text-xs fill-current">
                        0
                      </text>
                      <text x="205" y="470" textAnchor="middle" className="text-xs fill-current">
                        25
                      </text>
                      <text x="330" y="470" textAnchor="middle" className="text-xs fill-current">
                        50
                      </text>
                      <text x="455" y="470" textAnchor="middle" className="text-xs fill-current">
                        75
                      </text>
                      <text x="580" y="470" textAnchor="middle" className="text-xs fill-current">
                        100
                      </text>

                      {/* Y-axis labels */}
                      <text x="70" y="455" textAnchor="end" className="text-xs fill-current">
                        0
                      </text>
                      <text x="70" y="355" textAnchor="end" className="text-xs fill-current">
                        25
                      </text>
                      <text x="70" y="255" textAnchor="end" className="text-xs fill-current">
                        50
                      </text>
                      <text x="70" y="155" textAnchor="end" className="text-xs fill-current">
                        75
                      </text>
                      <text x="70" y="55" textAnchor="end" className="text-xs fill-current">
                        100
                      </text>

                      {/* Axis titles */}
                      <text x="330" y="495" textAnchor="middle" className="text-sm fill-current font-medium">
                        Risk Level →
                      </text>
                      <text
                        x="25"
                        y="250"
                        textAnchor="middle"
                        className="text-sm fill-current font-medium"
                        transform="rotate(-90, 25, 250)"
                      >
                        Business Impact →
                      </text>

                      {/* Data points */}
                      {matrixPoints.map((point) => {
                        const x = 80 + (point.x / 100) * 500
                        const y = 450 - (point.y / 100) * 400

                        return (
                          <Tooltip key={point.id}>
                            <TooltipTrigger asChild>
                              <circle
                                cx={x}
                                cy={y}
                                r="6"
                                fill={getPointColor(point.recommendation)}
                                stroke="white"
                                strokeWidth="2"
                                className="cursor-pointer hover:r-8 transition-all"
                                style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
                              />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <div className="space-y-1">
                                <p className="font-medium">{point.name}</p>
                                <p className="text-sm">Platform: {point.platformType}</p>
                                <p className="text-sm">Score: {point.score.toFixed(1)}/100</p>
                                <p className="text-sm">Recommendation: {point.recommendation}</p>
                                <p className="text-sm">Requestor: {point.requestor}</p>
                                <p className="text-sm">Date: {point.requestDate}</p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        )
                      })}
                    </svg>
                  </div>
                ) : (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>No evaluations found</AlertTitle>
                    <AlertDescription>
                      {completedEvaluations.length === 0
                        ? "Complete some security evaluations to see them plotted on the risk matrix."
                        : "No evaluations match the current filters. Try adjusting the filter criteria."}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Summary Statistics */}
            {matrixPoints.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Summary Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {matrixPoints.filter((p) => p.recommendation === "Approve").length}
                      </div>
                      <div className="text-sm text-muted-foreground">Approved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {matrixPoints.filter((p) => p.recommendation === "Approve with conditions").length}
                      </div>
                      <div className="text-sm text-muted-foreground">Conditional</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {matrixPoints.filter((p) => p.recommendation === "Reject").length}
                      </div>
                      <div className="text-sm text-muted-foreground">Rejected</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-lg font-medium">
                        Average Score:{" "}
                        {(matrixPoints.reduce((sum, p) => sum + p.score, 0) / matrixPoints.length).toFixed(1)}
                        /100
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <RiskTrendsChart />
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  )
}
