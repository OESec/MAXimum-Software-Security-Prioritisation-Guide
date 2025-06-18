import jsPDF from "jspdf"
import type { CalculationResult } from "@/lib/types"

interface PDFExportData {
  appName: string
  appDescription?: string
  requestor: string
  platformType: string
  evaluationDate: string
  result: CalculationResult
}

export function exportToPDF(data: PDFExportData) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  let yPosition = margin

  // Helper function to add text with automatic line wrapping
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize = 12) => {
    doc.setFontSize(fontSize)
    const lines = doc.splitTextToSize(text, maxWidth)
    doc.text(lines, x, y)
    return y + lines.length * fontSize * 0.4 // Return new Y position
  }

  // Helper function to check if we need a new page
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage()
      yPosition = margin
      return true
    }
    return false
  }

  // Header
  doc.setFontSize(20)
  doc.setFont("helvetica", "bold")
  doc.text("MAXimum Security Priority Calculator", margin, yPosition)
  yPosition += 15

  doc.setFontSize(16)
  doc.text("Security Evaluation Report", margin, yPosition)
  yPosition += 20

  // Application Details Section
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("Application Details", margin, yPosition)
  yPosition += 10

  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")

  // Application details table
  const details = [
    ["Application Name:", data.appName],
    ["Platform Type:", data.platformType],
    ["Requestor:", data.requestor],
    ["Evaluation Date:", data.evaluationDate],
  ]

  if (data.appDescription) {
    details.push(["Description:", data.appDescription])
  }

  details.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold")
    doc.text(label, margin, yPosition)
    doc.setFont("helvetica", "normal")
    yPosition = addWrappedText(value, margin + 40, yPosition, pageWidth - margin - 60)
    yPosition += 5
  })

  yPosition += 10

  // Overall Results Section
  checkPageBreak(40)
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("Overall Results", margin, yPosition)
  yPosition += 15

  // Score box
  doc.setFillColor(240, 240, 240)
  doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 25, "F")

  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text(
    `Overall Score: ${data.result.totalScore % 1 === 0 ? data.result.totalScore.toString() : data.result.totalScore.toFixed(1)}/100`,
    margin + 5,
    yPosition + 8,
  )

  // Recommendation with color coding
  const recommendation = data.result.recommendation
  if (recommendation === "Approve") {
    doc.setTextColor(0, 128, 0) // Green
  } else if (recommendation === "Approve with conditions") {
    doc.setTextColor(255, 140, 0) // Orange
  } else {
    doc.setTextColor(220, 20, 60) // Red
  }

  doc.text(`Recommendation: ${recommendation}`, margin + 5, yPosition + 18)
  doc.setTextColor(0, 0, 0) // Reset to black

  yPosition += 35

  // Recommendation explanation
  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  let explanationText = ""
  if (recommendation === "Approve") {
    explanationText = "This application meets security requirements and can be approved."
  } else if (recommendation === "Approve with conditions") {
    explanationText = "This application can be approved with additional security controls."
  } else {
    explanationText = "This application does not meet security requirements and should be rejected."
  }

  yPosition = addWrappedText(explanationText, margin, yPosition, pageWidth - 2 * margin)
  yPosition += 15

  // Detailed Scores Section
  checkPageBreak(30)
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("Detailed Criterion Scores", margin, yPosition)
  yPosition += 15

  // Table headers
  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.text("#", margin, yPosition)
  doc.text("Criterion", margin + 15, yPosition)
  doc.text("Weight", margin + 90, yPosition)
  doc.text("Selected Option", margin + 115, yPosition)
  doc.text("Score", margin + 160, yPosition)
  doc.text("Points", margin + 180, yPosition)

  // Draw header line
  doc.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2)
  yPosition += 8

  // Criterion details
  doc.setFont("helvetica", "normal")
  data.result.criteriaScores.forEach((score, index) => {
    checkPageBreak(15)

    const criterionNumber = (index + 1).toString()
    const criterionName =
      score.criterionName.length > 25 ? score.criterionName.substring(0, 22) + "..." : score.criterionName
    const weight = `${score.weight}%`
    const selectedOption =
      score.selectedOption.label.length > 15
        ? score.selectedOption.label.substring(0, 12) + "..."
        : score.selectedOption.label
    const rawScore = `${score.selectedOption.value}/100`
    const points = score.weightedScore % 1 === 0 ? score.weightedScore.toString() : score.weightedScore.toFixed(1)

    doc.text(criterionNumber, margin, yPosition)
    doc.text(criterionName, margin + 15, yPosition)
    doc.text(weight, margin + 90, yPosition)
    doc.text(selectedOption, margin + 115, yPosition)
    doc.text(rawScore, margin + 160, yPosition)
    doc.text(points, margin + 180, yPosition)

    yPosition += 6
  })

  // Footer
  const footerY = pageHeight - 15
  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(128, 128, 128)
  doc.text("Generated by MAXimum Security Priority Calculator | Creation of Edewede O.", margin, footerY)
  doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth - margin - 60, footerY)

  // Save the PDF
  const fileName = `Security_Evaluation_${data.appName.replace(/[^a-zA-Z0-9]/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`
  doc.save(fileName)
}
