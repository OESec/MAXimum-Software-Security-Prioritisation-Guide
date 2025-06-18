"use client"

import { useState, useEffect } from "react"
import { useStore } from "@/lib/store"
import { exportToPDF } from "@/lib/pdf-export"
import type { CalculationResult } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  HelpCircle,
  Download,
  Target,
  Building,
  Shield,
  Lock,
  FileCheck,
  Scale,
  Link,
  Server,
  Globe,
  Key,
  LogIn,
  Brain,
  Settings,
  Users,
  Eye,
  Clock,
  ChevronDown,
  ChevronUp,
  CalculatorIcon,
  Home,
} from "lucide-react"

interface CategoryProgress {
  name: string
  completed: number
  total: number
  percentage: number
  color: string
  isComplete: boolean
}

export function Calculator() {
  const { platformTypes, addAppRequest, calculateScore } = useStore()
  const { toast } = useToast()

  const [step, setStep] = useState<"details" | "evaluation">("details")
  const [selectedPlatformTypeId, setSelectedPlatformTypeId] = useState<string>("")
  const [appName, setAppName] = useState<string>("")
  const [appDescription, setAppDescription] = useState<string>("")
  const [requestor, setRequestor] = useState<string>("")
  const [selections, setSelections] = useState<Record<string, string>>({})
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [appRequestId, setAppRequestId] = useState<string | null>(null)
  const [showResetConfirmation, setShowResetConfirmation] = useState<boolean>(false)
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({})

  const selectedPlatformType = platformTypes.find((pt) => pt.id === selectedPlatformTypeId)

  const handlePlatformTypeChange = (value: string) => {
    setSelectedPlatformTypeId(value)
    setSelections({})
    setResult(null)
  }

  const handleSelectionChange = (criterionId: string, optionId: string) => {
    setSelections((prev) => ({
      ...prev,
      [criterionId]: optionId,
    }))
  }

  // Helper function to check if evaluation should be blocked
  const isEvaluationBlocked = (): boolean => {
    if (!selectedPlatformType || selectedPlatformType.name !== "Whitelisting websites") {
      return false
    }

    const managerApprovalCriterion = selectedPlatformType.criteria.find(
      (criterion) => criterion.name === "Approved by user's manager",
    )

    if (!managerApprovalCriterion) {
      return false
    }

    const selectedOptionId = selections[managerApprovalCriterion.id]
    const selectedOption = managerApprovalCriterion.options.find((option) => option.id === selectedOptionId)

    // Block if "Not approved" is selected (value 0)
    return selectedOption?.value === 0
  }

  // Real-time calculation effect
  useEffect(() => {
    if (!selectedPlatformType || !appRequestId) return

    // Check if evaluation is blocked
    if (isEvaluationBlocked()) {
      setResult(null)
      return
    }

    // Check if all criteria have selections
    const allCriteriaSelected = selectedPlatformType.criteria.every((criterion) => selections[criterion.id])

    if (allCriteriaSelected) {
      try {
        const calculationResult = calculateScore(appRequestId, selections)
        setResult(calculationResult)
      } catch (error) {
        // Handle calculation errors silently for real-time updates
        setResult(null)
      }
    } else {
      setResult(null)
    }
  }, [selections, selectedPlatformType, appRequestId, calculateScore])

  const handleDetailsSubmit = () => {
    if (!appName || !selectedPlatformTypeId || !requestor) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const id = addAppRequest({
      name: appName,
      description: appDescription,
      platformTypeId: selectedPlatformTypeId,
      requestor,
    })

    setAppRequestId(id)
    setStep("evaluation")
  }

  const resetCalculator = () => {
    setStep("details")
    setSelectedPlatformTypeId("")
    setAppName("")
    setAppDescription("")
    setRequestor("")
    setSelections({})
    setResult(null)
    setAppRequestId(null)
    setShowResetConfirmation(false)
    setExpandedDescriptions({})
  }

  const handleResetClick = () => {
    setShowResetConfirmation(true)
  }

  const handleExportPDF = () => {
    if (!result || !selectedPlatformType) {
      toast({
        title: "Cannot export",
        description: "Complete the evaluation before exporting to PDF",
        variant: "destructive",
      })
      return
    }

    try {
      exportToPDF({
        appName,
        appDescription,
        requestor,
        platformType: selectedPlatformType.name,
        evaluationDate: new Date().toLocaleDateString(),
        result,
      })

      toast({
        title: "PDF exported successfully",
        description: "The evaluation report has been downloaded",
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error generating the PDF report",
        variant: "destructive",
      })
    }
  }

  // Helper function to format score without unnecessary decimals
  const formatScore = (score: number): string => {
    return score % 1 === 0 ? score.toString() : score.toFixed(1)
  }

  // Helper function to get tooltip content for each criterion
  const getTooltipContent = (criterionName: string, platformTypeName: string): string => {
    const tooltips: Record<string, Record<string, string>> = {
      SaaS: {
        "Fits Business Strategy?":
          "Assess how well this app supports your organization's strategic goals and priorities.",
        "Vendor on approved list?":
          "Check if the vendor has completed your organization's approval and security assessment process.",
        "Already marked as Sanctioned by":
          "Determine what level of organizational approval this application has received.",
        Status: "Evaluate the maturity and stability of the application version you're considering.",
        "Risk score": "Overall risk assessment considering data sensitivity, business impact, and security concerns.",
        "Security risk factor":
          "Specific cybersecurity risks including data protection, access controls, and vendor security practices.",
        "Compliance risk factor":
          "Regulatory compliance including GDPR, industry standards, and organizational policies.",
        "Legal score":
          "Legal risks including contract terms, liability, data processing agreements, and jurisdictional issues.",
        "Connected Apps": "Number of integrations with other systems - more connections increase attack surface.",
        "App last authorised date": "How recently the application underwent security review and authorization.",
        "App Supplier Domain/URL": "Legitimacy and security of the vendor's web presence and domain.",
        "Login URL": "Security of the authentication endpoint - must use HTTPS with valid certificates.",
        "Is AI or similar?":
          "Applications using AI/ML may have additional risks related to data processing and transparency.",
        "Data Center location": "Critical for data sovereignty and regulatory compliance - affects legal jurisdiction.",
        "Internal Alternative Exists?":
          "Whether there's an existing internal solution that could meet the same business need.",
      },
      "Locally Installed": {
        "Vendor Reputation": "Trustworthiness and track record of the software vendor - established vendors are safer.",
        "Installation Privileges": "Level of system access required - admin privileges pose higher security risks.",
        "Security Scan": "Whether the application has been analyzed for malware and security vulnerabilities.",
        "Business Need": "Importance and urgency of the business requirement this application addresses.",
        "Internal Alternative Exists?":
          "Whether there's an existing internal solution that could meet the same business need.",
      },
      OAuth: {
        "Permissions Scope": "Extent of access permissions requested - follow principle of least privilege.",
        "App Verification":
          "Whether the application has been verified by the OAuth provider (Google, Microsoft, etc.).",
        "User Base": "Number of users affected - wider deployment increases potential impact if compromised.",
        "Data Access":
          "Sensitivity level of data accessed - public data poses minimal risk, restricted data poses high risk.",
        "Internal Alternative Exists?":
          "Whether there's an existing internal solution that could meet the same business need.",
      },
      Plugins: {
        "Permissions Requested": "Scope of permissions requested by the plugin - follow principle of least privilege.",
        "Developer Reputation": "Trustworthiness and track record of the plugin developer or organization.",
        "Data Access Level": "Type and sensitivity of data the plugin can access and process.",
        "Update Frequency": "How regularly the plugin is maintained and updated with security patches.",
        "Business Justification": "Business need and value provided by the plugin functionality.",
        "App Source and Publisher Verification":
          "Verify publisher identity, check trusted sources like Microsoft AppSource, review security certifications and validate digital signatures.",
        "Internal Alternative Exists?":
          "Whether there's an existing internal solution that could meet the same business need.",
      },
    }

    return (
      tooltips[platformTypeName]?.[criterionName] ||
      "Evaluate this criterion based on your organization's security requirements."
    )
  }

  // Helper function to get icon for each criterion
  const getCriterionIcon = (criterionName: string, platformTypeName: string) => {
    const iconMap: Record<string, Record<string, any>> = {
      SaaS: {
        "Fits Business Strategy?": Target,
        "Vendor on approved list?": Building,
        "Already marked as Sanctioned by": Shield,
        Status: CheckCircle2,
        "Risk score": AlertTriangle,
        "Security risk factor": Lock,
        "Compliance risk factor": FileCheck,
        "Legal score": Scale,
        "Connected Apps": Link,
        "App last authorised date": Clock,
        "App Supplier Domain/URL": Globe,
        "Login URL": LogIn,
        "Is AI or similar?": Brain,
        "Data Center location": Server,
        "Internal Alternative Exists?": Home,
      },
      "Locally Installed": {
        "Vendor Reputation": Building,
        "Installation Privileges": Settings,
        "Security Scan": Shield,
        "Business Need": Target,
        "Internal Alternative Exists?": Home,
      },
      OAuth: {
        "Permissions Scope": Key,
        "App Verification": CheckCircle2,
        "User Base": Users,
        "Data Access": Eye,
        "Internal Alternative Exists?": Home,
      },
      Plugins: {
        "Permissions Requested": Key,
        "Developer Reputation": Building,
        "Data Access Level": Eye,
        "Update Frequency": Clock,
        "Business Justification": Target,
        "App Source and Publisher Verification": FileCheck,
        "Internal Alternative Exists?": Home,
      },
    }

    const IconComponent = iconMap[platformTypeName]?.[criterionName] || Shield
    return <IconComponent className="h-4 w-4 text-muted-foreground" />
  }

  // Helper function to get category mappings for different platform types
  const getCategoryMappings = (platformTypeName: string): Record<string, string[]> => {
    const mappings: Record<string, Record<string, string[]>> = {
      SaaS: {
        "Business Alignment": [
          "Fits Business Strategy?",
          "Vendor on approved list?",
          "Already marked as Sanctioned by",
          "Internal Alternative Exists?",
        ],
        "Technical Assessment": ["Status", "Connected Apps", "Is AI or similar?"],
        "Risk & Security": ["Risk score", "Security risk factor"],
        "Compliance & Legal": ["Compliance risk factor", "Legal score"],
        "Infrastructure & Access": [
          "Data Center location",
          "Login URL",
          "App Supplier Domain/URL",
          "App last authorised date",
        ],
      },
      "Locally Installed": {
        "Vendor Assessment": ["Vendor Reputation"],
        "Technical Security": ["Installation Privileges", "Security Scan"],
        "Business Justification": ["Business Need", "Internal Alternative Exists?"],
      },
      OAuth: {
        "Access Control": ["Permissions Scope", "Data Access"],
        "Verification & Trust": ["App Verification"],
        "Impact Assessment": ["User Base", "Internal Alternative Exists?"],
      },
      Plugins: {
        "Trust & Verification": ["Developer Reputation", "App Source and Publisher Verification"],
        "Access & Permissions": ["Permissions Requested", "Data Access Level"],
        "Maintenance & Business": ["Update Frequency", "Business Justification", "Internal Alternative Exists?"],
      },
    }

    return mappings[platformTypeName] || {}
  }

  // Helper function to calculate completion percentage
  const getCompletionPercentage = (): number => {
    if (!selectedPlatformType) return 0
    const totalCriteria = selectedPlatformType.criteria.length
    const answeredCriteria = selectedPlatformType.criteria.filter((criterion) => selections[criterion.id]).length
    return totalCriteria > 0 ? Math.round((answeredCriteria / totalCriteria) * 100) : 0
  }

  // Helper function to get detailed scores for display (works with or without complete results)
  const getDetailedScoresForDisplay = () => {
    if (!selectedPlatformType) return []

    return selectedPlatformType.criteria.map((criterion, index) => {
      const selectedOptionId = selections[criterion.id]
      const selectedOption = criterion.options.find((o) => o.id === selectedOptionId)

      let weightedScore = 0
      let progressValue = 0

      if (selectedOption) {
        weightedScore = (selectedOption.value / 100) * criterion.weight
        progressValue = (weightedScore / criterion.weight) * 100
      }

      return {
        criterionId: criterion.id,
        criterionName: criterion.name,
        weight: criterion.weight,
        selectedOption,
        weightedScore,
        progressValue,
        index: index + 1,
      }
    })
  }

  // Helper function to get category progress
  const getCategoryProgress = (): CategoryProgress[] => {
    if (!selectedPlatformType) return []

    const categoryMappings = getCategoryMappings(selectedPlatformType.name)
    const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-pink-500", "bg-indigo-500"]

    return Object.entries(categoryMappings).map(([categoryName, criteriaNames], index) => {
      const categoryCriteria = selectedPlatformType.criteria.filter((criterion) =>
        criteriaNames.includes(criterion.name),
      )
      const completedCriteria = categoryCriteria.filter((criterion) => selections[criterion.id])

      return {
        name: categoryName,
        completed: completedCriteria.length,
        total: categoryCriteria.length,
        percentage:
          categoryCriteria.length > 0 ? Math.round((completedCriteria.length / categoryCriteria.length) * 100) : 0,
        color: colors[index % colors.length],
        isComplete: completedCriteria.length === categoryCriteria.length && categoryCriteria.length > 0,
      }
    })
  }

  const toggleDescription = (criterionId: string) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [criterionId]: !prev[criterionId],
    }))
  }

  return (
    <TooltipProvider>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Application Security Evaluation</CardTitle>
          <CardDescription>Evaluate security risks for application installation requests</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={step} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details" disabled={step !== "details"}>
                App Details
              </TabsTrigger>
              <TabsTrigger value="evaluation" disabled={step !== "evaluation"}>
                Security Evaluation
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 pt-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="platform-type">Platform Type</Label>
                  <Select value={selectedPlatformTypeId} onValueChange={handlePlatformTypeChange}>
                    <SelectTrigger id="platform-type">
                      <SelectValue placeholder="Select platform type" />
                    </SelectTrigger>
                    <SelectContent>
                      {platformTypes.map((platformType) => (
                        <SelectItem key={platformType.id} value={platformType.id}>
                          {platformType.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="app-name">Application Name</Label>
                  <Input
                    id="app-name"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    placeholder="Enter application name"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="app-description">Description</Label>
                  <Input
                    id="app-description"
                    value={appDescription}
                    onChange={(e) => setAppDescription(e.target.value)}
                    placeholder="Enter application description"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="requestor">Requestor</Label>
                  <Input
                    id="requestor"
                    value={requestor}
                    onChange={(e) => setRequestor(e.target.value)}
                    placeholder="Enter requestor name"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="evaluation" className="pt-4">
              {selectedPlatformType ? (
                <div className="space-y-6">
                  {/* App Details Summary */}
                  <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950/20">
                    <Info className="h-5 w-5 text-blue-500" />
                    <AlertTitle>Application Details</AlertTitle>
                    <AlertDescription>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                        <div>
                          <span className="font-medium">Name:</span> {appName}
                        </div>
                        <div>
                          <span className="font-medium">Platform:</span> {selectedPlatformType.name}
                        </div>
                        <div>
                          <span className="font-medium">Requestor:</span> {requestor}
                        </div>
                        {appDescription && (
                          <div className="md:col-span-2 lg:col-span-1">
                            <span className="font-medium">Description:</span> {appDescription}
                          </div>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>

                  {/* Blocked Evaluation Alert */}
                  {isEvaluationBlocked() && (
                    <Alert className="border-red-500 bg-red-50 dark:bg-red-950/20">
                      <XCircle className="h-5 w-5 text-red-500" />
                      <AlertTitle>Evaluation Blocked</AlertTitle>
                      <AlertDescription>
                        <div className="space-y-2">
                          <p>
                            This website whitelist request cannot proceed because it has not been approved by the user's
                            manager.
                          </p>
                          <p className="text-sm font-medium">
                            Manager approval is required before any security evaluation can be completed.
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Please obtain manager approval and select "Yes" for "Approved by user's manager" to
                            continue.
                          </p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Results Section */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Results</h3>
                      {result && !isEvaluationBlocked() && (
                        <Button onClick={handleExportPDF} variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Export PDF
                        </Button>
                      )}
                    </div>

                    {/* Overall Score */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="text-base font-medium">Overall Score</h4>
                        <span className="text-2xl font-bold">
                          {result && !isEvaluationBlocked() ? `${formatScore(result.totalScore)}/100` : "0/100"}
                        </span>
                      </div>
                      <Progress
                        value={result && !isEvaluationBlocked() ? result.totalScore : 0}
                        className={`h-3 ${isEvaluationBlocked() ? "opacity-50" : ""}`}
                      />
                      {isEvaluationBlocked() && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                          Evaluation blocked - manager approval required
                        </p>
                      )}
                    </div>

                    {/* Recommendation */}
                    {result && !isEvaluationBlocked() && (
                      <Alert
                        className={
                          result.recommendation === "Approve"
                            ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                            : result.recommendation === "Approve with conditions"
                              ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"
                              : "border-red-500 bg-red-50 dark:bg-red-950/20"
                        }
                      >
                        {result.recommendation === "Approve" ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : result.recommendation === "Approve with conditions" ? (
                          <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <AlertTitle>Recommendation: {result.recommendation}</AlertTitle>
                        <AlertDescription>
                          {result.recommendation === "Approve"
                            ? "This application meets security requirements and can be approved."
                            : result.recommendation === "Approve with conditions"
                              ? "This application can be approved with additional security controls."
                              : "This application does not meet security requirements and should be rejected."}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Detailed Scores Progress - Always visible but greyed out when blocked */}
                    <div className={`space-y-3 ${isEvaluationBlocked() ? "opacity-50" : ""}`}>
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Detailed Scores {isEvaluationBlocked() && "(Blocked)"}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {getDetailedScoresForDisplay().map((score) => (
                          <div key={score.criterionId} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-xs font-medium">
                                {score.index}. {score.criterionName} ({score.weight}%)
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {score.selectedOption && !isEvaluationBlocked()
                                  ? `${formatScore(score.weightedScore)} pts`
                                  : "0 pts"}
                              </span>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>
                                {score.selectedOption ? `Selected: ${score.selectedOption.label}` : "Not selected"}
                              </span>
                              <span>
                                {score.selectedOption ? `Raw: ${score.selectedOption.value}/100` : "Raw: 0/100"}
                              </span>
                            </div>
                            <Progress value={isEvaluationBlocked() ? 0 : score.progressValue} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CalculatorIcon className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-medium">Security Criteria Calculator</h3>
                    </div>

                    {/* Calculator Display Screen */}
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-700 shadow-inner">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {selectedPlatformType.criteria.map((criterion, index) => (
                          <div
                            key={criterion.id}
                            className="bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 overflow-hidden"
                          >
                            {/* Calculator Button Header */}
                            <div className="bg-gray-50 dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700">
                              <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                                    {index + 1}
                                  </span>
                                  <Label className="text-sm font-medium">{criterion.name}</Label>
                                  {getCriterionIcon(criterion.name, selectedPlatformType.name)}
                                </div>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs">
                                    <p>{getTooltipContent(criterion.name, selectedPlatformType.name)}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                              <div className="flex justify-between items-center mt-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleDescription(criterion.id)}
                                  className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
                                >
                                  Description
                                  {expandedDescriptions[criterion.id] ? (
                                    <ChevronUp className="ml-1 h-3 w-3" />
                                  ) : (
                                    <ChevronDown className="ml-1 h-3 w-3" />
                                  )}
                                </Button>
                                <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
                                  {criterion.weight}%
                                </span>
                              </div>
                              {expandedDescriptions[criterion.id] && (
                                <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md border-l-2 border-primary">
                                  <p className="text-xs text-muted-foreground">{criterion.description}</p>
                                </div>
                              )}
                            </div>

                            {/* Calculator Button Options */}
                            <div
                              className={`p-3 ${isEvaluationBlocked() && criterion.name !== "Approved by user's manager" ? "opacity-50 pointer-events-none" : ""}`}
                            >
                              <RadioGroup
                                value={selections[criterion.id] || ""}
                                onValueChange={(value) => handleSelectionChange(criterion.id, value)}
                                className="space-y-1"
                                disabled={isEvaluationBlocked() && criterion.name !== "Approved by user's manager"}
                              >
                                {criterion.options.map((option) => (
                                  <div
                                    key={option.id}
                                    className={`flex items-center space-x-2 p-2 rounded-md transition-colors ${
                                      selections[criterion.id] === option.id
                                        ? "bg-primary/10 dark:bg-primary/20"
                                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                    } ${isEvaluationBlocked() && criterion.name !== "Approved by user's manager" ? "cursor-not-allowed" : ""}`}
                                  >
                                    <RadioGroupItem
                                      value={option.id}
                                      id={option.id}
                                      disabled={
                                        isEvaluationBlocked() && criterion.name !== "Approved by user's manager"
                                      }
                                    />
                                    <Label
                                      htmlFor={option.id}
                                      className={`flex justify-between w-full text-sm ${
                                        isEvaluationBlocked() && criterion.name !== "Approved by user's manager"
                                          ? "cursor-not-allowed"
                                          : "cursor-pointer"
                                      }`}
                                    >
                                      <span>{option.label}</span>
                                      <span
                                        className={`text-xs px-1.5 py-0.5 rounded ${
                                          option.value >= 80
                                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                            : option.value >= 40
                                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                        }`}
                                      >
                                        {option.value}
                                      </span>
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p>Please select a platform type first</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          {step !== "details" && (
            <Button variant="outline" onClick={() => setStep("details")}>
              Back to Details
            </Button>
          )}
          {step === "details" ? (
            <Button onClick={handleDetailsSubmit}>Continue to Evaluation</Button>
          ) : (
            <AlertDialog open={showResetConfirmation} onOpenChange={setShowResetConfirmation}>
              <AlertDialogTrigger asChild>
                <Button onClick={handleResetClick}>Start New Evaluation</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will clear all your current evaluation data and start over. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={resetCalculator}>Yes, start new evaluation</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardFooter>
      </Card>
    </TooltipProvider>
  )
}
