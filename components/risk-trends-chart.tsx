"use client"

import { useState, useMemo } from "react"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts"
import { Info, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface TrendDataPoint {
  date: string
  averageScore: number
  totalEvaluations: number
  approved: number
  conditional: number
  rejected: number
  approvedPercentage: number
  conditionalPercentage: number
  rejectedPercentage: number
}

export function RiskTrendsChart() {
  const { appRequests, platformTypes } = useStore()
  const [selectedPlatformType, setSelectedPlatformType] = useState<string>("all")
  const [timeRange, setTimeRange] = useState<string>("30") // days
  const [chartType, setChartType] = useState<string>("score") // score, volume, distribution

  // Filter completed evaluations
  const completedEvaluations = appRequests.filter((request) => request.calculationResult)

  // Process data for trends
  const trendData = useMemo(() => {
    let filtered = completedEvaluations

    if (selectedPlatformType !== "all") {
      filtered = filtered.filter((request) => request.platformTypeId === selectedPlatformType)
    }

    // Filter by time range
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - Number.parseInt(timeRange))
    filtered = filtered.filter((request) => new Date(request.requestDate) >= cutoffDate)

    if (filtered.length === 0) return []

    // Group by date (daily aggregation)
    const groupedByDate = filtered.reduce(
      (acc, request) => {
        const date = new Date(request.requestDate).toISOString().split("T")[0]
        if (!acc[date]) {
          acc[date] = []
        }
        acc[date].push(request)
        return acc
      },
      {} as Record<string, typeof filtered>,
    )

    // Create trend data points
    const trendPoints: TrendDataPoint[] = Object.entries(groupedByDate)
      .map(([date, requests]) => {
        const scores = requests.map((r) => r.calculationResult!.totalScore)
        const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length

        const approved = requests.filter((r) => r.calculationResult!.recommendation === "Approve").length
        const conditional = requests.filter(
          (r) => r.calculationResult!.recommendation === "Approve with conditions",
        ).length
        const rejected = requests.filter((r) => r.calculationResult!.recommendation === "Reject").length
        const total = requests.length

        return {
          date,
          averageScore: Math.round(averageScore * 10) / 10,
          totalEvaluations: total,
          approved,
          conditional,
          rejected,
          approvedPercentage: Math.round((approved / total) * 100),
          conditionalPercentage: Math.round((conditional / total) * 100),
          rejectedPercentage: Math.round((rejected / total) * 100),
        }
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return trendPoints
  }, [completedEvaluations, selectedPlatformType, timeRange])

  // Calculate trend indicators
  const trendIndicators = useMemo(() => {
    if (trendData.length < 2) return null

    const firstPoint = trendData[0]
    const lastPoint = trendData[trendData.length - 1]

    const scoreTrend = lastPoint.averageScore - firstPoint.averageScore
    const volumeTrend = lastPoint.totalEvaluations - firstPoint.totalEvaluations
    const approvalTrend = lastPoint.approvedPercentage - firstPoint.approvedPercentage

    return {
      score: {
        value: scoreTrend,
        direction: scoreTrend > 2 ? "up" : scoreTrend < -2 ? "down" : "stable",
        label: scoreTrend > 0 ? `+${scoreTrend.toFixed(1)}` : scoreTrend.toFixed(1),
      },
      volume: {
        value: volumeTrend,
        direction: volumeTrend > 0 ? "up" : volumeTrend < 0 ? "down" : "stable",
        label: volumeTrend > 0 ? `+${volumeTrend}` : volumeTrend.toString(),
      },
      approval: {
        value: approvalTrend,
        direction: approvalTrend > 5 ? "up" : approvalTrend < -5 ? "down" : "stable",
        label: approvalTrend > 0 ? `+${approvalTrend}%` : `${approvalTrend}%`,
      },
    }
  }, [trendData])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Trends Over Time</CardTitle>
          <CardDescription>Track security evaluation patterns and trends across different time periods</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
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
              <label htmlFor="time-range" className="text-sm font-medium">
                Time Range:
              </label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger id="time-range" className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="chart-type" className="text-sm font-medium">
                Chart Type:
              </label>
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger id="chart-type" className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score">Average Scores</SelectItem>
                  <SelectItem value="volume">Evaluation Volume</SelectItem>
                  <SelectItem value="distribution">Recommendation Mix</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trend Indicators */}
      {trendIndicators && (
        <Card>
          <CardHeader>
            <CardTitle>Trend Summary</CardTitle>
            <CardDescription>Key metrics compared to the start of the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="text-sm text-muted-foreground">Average Score</div>
                  <div className={`text-lg font-medium ${getTrendColor(trendIndicators.score.direction)}`}>
                    {trendIndicators.score.label} points
                  </div>
                </div>
                {getTrendIcon(trendIndicators.score.direction)}
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="text-sm text-muted-foreground">Daily Volume</div>
                  <div className={`text-lg font-medium ${getTrendColor(trendIndicators.volume.direction)}`}>
                    {trendIndicators.volume.label} evaluations
                  </div>
                </div>
                {getTrendIcon(trendIndicators.volume.direction)}
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="text-sm text-muted-foreground">Approval Rate</div>
                  <div className={`text-lg font-medium ${getTrendColor(trendIndicators.approval.direction)}`}>
                    {trendIndicators.approval.label}
                  </div>
                </div>
                {getTrendIcon(trendIndicators.approval.direction)}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts */}
      <Card>
        <CardHeader>
          <CardTitle>
            {chartType === "score"
              ? "Average Security Scores"
              : chartType === "volume"
                ? "Evaluation Volume"
                : "Recommendation Distribution"}
          </CardTitle>
          <CardDescription>
            {chartType === "score"
              ? "Daily average security scores over time"
              : chartType === "volume"
                ? "Number of evaluations completed per day"
                : "Breakdown of recommendations over time"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {trendData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "score" ? (
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={formatDate} />
                    <YAxis domain={[0, 100]} />
                    <Tooltip
                      labelFormatter={(value) => `Date: ${formatDate(value as string)}`}
                      formatter={(value: number) => [`${value.toFixed(1)}`, "Average Score"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="averageScore"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                ) : chartType === "volume" ? (
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={formatDate} />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) => `Date: ${formatDate(value as string)}`}
                      formatter={(value: number) => [value, "Evaluations"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="totalEvaluations"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                ) : (
                  <BarChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={formatDate} />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) => `Date: ${formatDate(value as string)}`}
                      formatter={(value: number, name: string) => [
                        value,
                        name === "approved"
                          ? "Approved"
                          : name === "conditional"
                            ? "Conditional"
                            : name === "rejected"
                              ? "Rejected"
                              : name,
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="approved" stackId="a" fill="#22c55e" name="Approved" />
                    <Bar dataKey="conditional" stackId="a" fill="#f59e0b" name="Conditional" />
                    <Bar dataKey="rejected" stackId="a" fill="#ef4444" name="Rejected" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          ) : (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>No trend data available</AlertTitle>
              <AlertDescription>
                {completedEvaluations.length === 0
                  ? "Complete some security evaluations to see trend analysis."
                  : "No evaluations found in the selected time range. Try expanding the time range or adjusting filters."}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Data Summary */}
      {trendData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Period Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">
                  {trendData.reduce((sum, point) => sum + point.totalEvaluations, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Evaluations</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {(
                    trendData.reduce((sum, point) => sum + point.averageScore * point.totalEvaluations, 0) /
                    trendData.reduce((sum, point) => sum + point.totalEvaluations, 0)
                  ).toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">Overall Average Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {Math.round(
                    (trendData.reduce((sum, point) => sum + point.approved, 0) /
                      trendData.reduce((sum, point) => sum + point.totalEvaluations, 0)) *
                      100,
                  )}
                  %
                </div>
                <div className="text-sm text-muted-foreground">Approval Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{trendData.length}</div>
                <div className="text-sm text-muted-foreground">Active Days</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
