"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, FileText, Info, Star, Weight, CheckCircle2, AlertTriangle, XCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function CriteriaReference() {
  const { platformTypes } = useStore()
  const { toast } = useToast()
  const [selectedPlatformId, setSelectedPlatformId] = useState<string>(platformTypes[0]?.id || "")

  const selectedPlatform = platformTypes.find((p) => p.id === selectedPlatformId)

  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-green-600 bg-green-50 dark:bg-green-950/20"
    if (score >= 60) return "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20"
    if (score >= 40) return "text-orange-600 bg-orange-50 dark:bg-orange-950/20"
    return "text-red-600 bg-red-50 dark:bg-red-950/20"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle2 className="h-3 w-3" />
    if (score >= 40) return <AlertTriangle className="h-3 w-3" />
    return <XCircle className="h-3 w-3" />
  }

  const getPreferredOption = (options: any[]) => {
    return options.reduce((max, option) => (option.value > max.value ? option : max), options[0])
  }

  const exportToCSV = (platformType: any) => {
    const headers = [
      "Criterion",
      "Description",
      "Weight (%)",
      "Preferred Option",
      "Preferred Score",
      "All Options (Option: Score)",
    ]

    const rows = platformType.criteria.map((criterion: any) => {
      const preferred = getPreferredOption(criterion.options)
      const allOptions = criterion.options.map((opt: any) => `${opt.label}: ${opt.value}`).join(" | ")

      return [
        criterion.name,
        criterion.description.replace(/"/g, '""'), // Escape quotes for CSV
        criterion.weight.toString(),
        preferred.label,
        preferred.value.toString(),
        allOptions,
      ]
    })

    const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute(
      "download",
      `${platformType.name}_Security_Criteria_${new Date().toISOString().split("T")[0]}.csv`,
    )
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export successful",
      description: `${platformType.name} criteria exported to CSV`,
    })
  }

  const exportAllToCSV = () => {
    const allData = platformTypes.flatMap((platformType) => {
      const platformData = platformType.criteria.map((criterion: any) => {
        const preferred = getPreferredOption(criterion.options)
        const allOptions = criterion.options.map((opt: any) => `${opt.label}: ${opt.value}`).join(" | ")

        return {
          platform: platformType.name,
          criterion: criterion.name,
          description: criterion.description,
          weight: criterion.weight,
          preferredOption: preferred.label,
          preferredScore: preferred.value,
          allOptions: allOptions,
        }
      })
      return platformData
    })

    const headers = [
      "Platform Type",
      "Criterion",
      "Description",
      "Weight (%)",
      "Preferred Option",
      "Preferred Score",
      "All Options (Option: Score)",
    ]

    const rows = allData.map((item) => [
      item.platform,
      item.criterion,
      item.description.replace(/"/g, '""'),
      item.weight.toString(),
      item.preferredOption,
      item.preferredScore.toString(),
      item.allOptions,
    ])

    const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `All_Security_Criteria_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export successful",
      description: "All platform criteria exported to CSV",
    })
  }

  if (platformTypes.length === 0) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>No platform types available</AlertTitle>
        <AlertDescription>
          No platform types have been configured yet. Please use the Admin panel to set up platform types and criteria.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with export options */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Security Criteria Quick Reference
              </CardTitle>
              <CardDescription>
                Complete list of security evaluation criteria for all platform types. Use this reference to understand
                evaluation standards and preferred settings.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={exportAllToCSV} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export All CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950/20">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertTitle>How to use this reference</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
                <li>
                  <strong>Preferred options</strong> are marked with a star (★) and represent the highest-scoring choice
                </li>
                <li>
                  <strong>Weights</strong> show the relative importance of each criterion in the overall score
                </li>
                <li>
                  <strong>Color coding:</strong> Green (80-100) = Low risk, Yellow (60-79) = Medium risk, Orange (40-59)
                  = High risk, Red (0-39) = Critical risk
                </li>
                <li>Export individual platform criteria or all platforms to CSV for offline reference</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Platform Tabs */}
      <Tabs value={selectedPlatformId} onValueChange={setSelectedPlatformId} className="w-full">
        <TabsList className="flex w-full">
          {platformTypes.map((platform) => (
            <TabsTrigger key={platform.id} value={platform.id} className="flex-1 text-xs px-2">
              {platform.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {platformTypes.map((platform) => (
          <TabsContent key={platform.id} value={platform.id} className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{platform.name} Security Criteria</CardTitle>
                    <CardDescription>{platform.description}</CardDescription>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Weight className="h-4 w-4" />
                        {platform.criteria.length} criteria
                      </span>
                      <span>Total weight: {platform.criteria.reduce((sum, c) => sum + c.weight, 0)}%</span>
                    </div>
                  </div>
                  <Button onClick={() => exportToCSV(platform)} variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Criterion</TableHead>
                        <TableHead className="w-[80px] text-center">Weight</TableHead>
                        <TableHead className="min-w-[300px]">Description</TableHead>
                        <TableHead className="min-w-[400px]">Available Options</TableHead>
                        <TableHead className="w-[150px]">Preferred Choice</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {platform.criteria.map((criterion, index) => {
                        const preferredOption = getPreferredOption(criterion.options)
                        return (
                          <TableRow key={criterion.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-start gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {index + 1}
                                </Badge>
                                <span className="text-sm">{criterion.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="secondary" className="text-xs">
                                {criterion.weight}%
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <p className="text-xs text-muted-foreground leading-relaxed">{criterion.description}</p>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-2">
                                {criterion.options
                                  .sort((a, b) => b.value - a.value) // Sort by score descending
                                  .map((option) => (
                                    <div
                                      key={option.id}
                                      className={`flex items-center justify-between p-2 rounded-md border ${getScoreColor(option.value)}`}
                                    >
                                      <div className="flex items-center gap-2">
                                        {option.id === preferredOption.id && <Star className="h-3 w-3 fill-current" />}
                                        <span className="text-xs font-medium">{option.label}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        {getScoreIcon(option.value)}
                                        <Badge variant="outline" className="text-xs">
                                          {option.value}
                                        </Badge>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div
                                className={`p-3 rounded-lg border-2 ${getScoreColor(preferredOption.value)} border-current`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <Star className="h-4 w-4 fill-current" />
                                  <span className="text-sm font-bold">{preferredOption.label}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  {getScoreIcon(preferredOption.value)}
                                  <Badge className="text-xs">Score: {preferredOption.value}</Badge>
                                </div>
                                {preferredOption.description && (
                                  <p className="text-xs mt-2 opacity-80">{preferredOption.description}</p>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Comparison Summary</CardTitle>
          <CardDescription>Overview of criteria count and complexity across all platform types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {platformTypes.map((platform) => (
              <div key={platform.id} className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">{platform.name}</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Criteria count:</span>
                    <span className="font-medium">{platform.criteria.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total weight:</span>
                    <span className="font-medium">{platform.criteria.reduce((sum, c) => sum + c.weight, 0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg. weight per criterion:</span>
                    <span className="font-medium">
                      {platform.criteria.length > 0
                        ? Math.round(platform.criteria.reduce((sum, c) => sum + c.weight, 0) / platform.criteria.length)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total options:</span>
                    <span className="font-medium">
                      {platform.criteria.reduce((sum, c) => sum + c.options.length, 0)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
