# MAXimum Security Prioritisation Calculator



# MAXimum Security Priority Calculator - User Guide

## Table of Contents

1. [Getting Started](#getting-started)
2. [Understanding the Platform](#understanding-the-platform)
3. [Using the Criteria Reference](#using-the-criteria-reference)
4. [Performing Security Evaluations](#performing-security-evaluations)
5. [Understanding Results](#understanding-results)
6. [Using the Risk Matrix](#using-the-risk-matrix)
7. [Administrative Functions](#administrative-functions)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)


---

## Getting Started

### What is the MAXimum Security Priority Calculator?

The MAXimum Security Priority Calculator is a comprehensive security evaluation tool designed to help organisations assess the risk of application installation requests. It provides standardized, weighted scoring across different platform types to ensure consistent security decision-making.

### Accessing the Platform

1. Navigate to the platform URL in your web browser
2. The homepage provides an overview of features and capabilities
3. Use the navigation bar to access different sections:

1. **Criteria Reference**: View all security criteria and scoring guidelines
2. **Calculator**: Perform security evaluations
3. **Risk Matrix**: Visualize evaluation results and trends
4. **Admin**: Configure platform types and criteria (admin access required)





---

## Understanding the Platform

### Platform Types

The calculator supports multiple platform types, each with tailored security criteria:

- **SaaS (Software as a Service)**: Cloud-based applications
- **Locally Installed**: Applications installed on local devices
- **OAuth**: Applications using OAuth for authorization
- **Plugins**: Browser extensions, IDE plugins, and application add-ons
- **Whitelisting websites**: Requests to whitelist blocked websites and domains


### Scoring System

- **Scores range from 0-100** for each criterion
- **Weighted scoring** ensures important criteria have greater impact
- **Final recommendations**:

- **80-100**: Approve (Green)
- **60-79**: Approve with conditions (Yellow/Orange)
- **0-59**: Reject (Red)





---

## Using the Criteria Reference

### Purpose

The Criteria Reference is your comprehensive guide to understanding all security evaluation criteria across platform types. **Start here** to familiarize yourself with evaluation standards.

### How to Use

1. **Navigate to Criteria Reference** (first tab in navigation)
2. **Select a platform type** using the tabs at the top
3. **Review each criterion**:

1. **Description**: Detailed explanation of what's being evaluated
2. **Weight**: Relative importance in the overall score
3. **Available Options**: All possible choices with scores
4. **Preferred Choice**: Highest-scoring option (marked with ★)





### Key Features

- **Color coding**: Green (80-100) = Low risk, Yellow (60-79) = Medium risk, Orange (40-59) = High risk, Red (0-39) = Critical risk
- **Export functionality**: Download criteria as CSV for offline reference
- **Platform comparison**: View statistics across all platform types


### Best Practice

Review the Criteria Reference before performing evaluations to understand scoring rationale and preferred security configurations.

---

## Performing Security Evaluations

### Step 1: Application Details

1. **Navigate to Calculator**
2. **Select Platform Type**: Choose the appropriate category for your application
3. **Enter Application Information**:

1. **Application Name**: Clear, descriptive name
2. **Description**: Brief explanation of functionality (optional but recommended)
3. **Requestor**: Name of person requesting the application



4. **Click "Continue to Evaluation"**


### Step 2: Security Evaluation

The evaluation interface presents a calculator-style layout with:

#### Application Summary

- Review entered details at the top of the page
- Verify platform type and requestor information


#### Real-time Results Panel

- **Overall Score**: Updates automatically as you make selections
- **Progress bar**: Visual representation of current score
- **Recommendation**: Updates based on current score
- **Detailed Scores**: Shows weighted scores for each completed criterion


#### Security Criteria Calculator

Each criterion appears as a calculator button with:

- **Criterion name and number**
- **Weight percentage**
- **Help icon** (hover for detailed guidance)
- **Description toggle** (expandable explanation)
- **Radio button options** with scores


### Step 3: Making Selections

1. **Work through each criterion systematically**
2. **Use the help tooltips** for guidance on each criterion
3. **Consider the "Internal Alternative Exists?" criterion first** - this appears at the top of all platform types
4. **Watch the real-time score updates** as you make selections
5. **Review detailed scores** to understand the impact of each choice


### Step 4: Completing the Evaluation

- **All criteria must be answered** before getting a final recommendation
- **Export to PDF** once complete for documentation
- **Start New Evaluation** to assess another application


---

## Understanding Results

### Overall Score Interpretation

- **80-100 (Approve)**: Application meets security requirements
- **60-79 (Approve with conditions)**: Application acceptable with additional controls
- **0-59 (Reject)**: Application does not meet security standards


### Detailed Score Breakdown

Each criterion shows:

- **Selected option** and its raw score (0-100)
- **Weight percentage** of the criterion
- **Weighted points** contributed to total score
- **Progress bar** showing relative contribution


### Recommendation Explanations

- **Approve**: Strong security posture, minimal additional controls needed
- **Approve with conditions**: Acceptable risk with compensating controls
- **Reject**: Unacceptable risk level, recommend alternative solutions


### PDF Export

Generated reports include:

- Application details and evaluation date
- Overall score and recommendation
- Detailed criterion-by-criterion breakdown
- Explanation of recommendation rationale


---

## Using the Risk Matrix

### Risk Matrix Visualization

The Risk Matrix provides visual analysis of all completed evaluations:

#### Matrix Plot

- **X-axis**: Risk Level (higher = more risk)
- **Y-axis**: Business Impact (higher = more impact)
- **Color coding**: Green (Approved), Orange (Conditional), Red (Rejected)
- **Interactive points**: Hover for detailed information


#### Filtering Options

- **Platform Type**: Filter by specific platform categories
- **Recommendation**: Show only specific recommendation types
- **Time Range**: Adjust date ranges for trend analysis


### Risk Trends Analysis

Switch to the "Risk Trends" tab for:

- **Average security scores over time**
- **Evaluation volume trends**
- **Recommendation distribution patterns**
- **Trend indicators** showing directional changes


### Summary Statistics

- **Total evaluations** by recommendation type
- **Average scores** across time periods
- **Approval rates** and trend analysis


---

## Administrative Functions

### Platform Type Management

Administrators can:

- **Add new platform types** with custom descriptions
- **Edit existing platform types**
- **Delete unused platform types**


### Criteria Management

For each platform type:

- **Add new security criteria** with descriptions and weights
- **Edit existing criteria** including names, descriptions, and weights
- **Delete outdated criteria**
- **Normalize weights** to ensure they sum to 100%


### Option Management

For each criterion:

- **Add scoring options** with values (0-100) and descriptions
- **Edit existing options** to update labels, scores, or descriptions
- **Delete unused options**


### Best Practices for Administrators

- **Regularly review criteria** to ensure they remain current
- **Normalize weights** after making changes
- **Test new criteria** with sample evaluations
- **Document changes** for audit purposes


---

## Best Practices

### Before Starting Evaluations

1. **Review the Criteria Reference** to understand scoring methodology
2. **Gather application information** including vendor details, functionality, and business justification
3. **Identify the correct platform type** for accurate evaluation


### During Evaluations

1. **Answer "Internal Alternative Exists?" first** - this is prioritized across all platform types
2. **Use help tooltips** for guidance on unfamiliar criteria
3. **Consider business context** when making selections
4. **Review real-time scores** to understand the impact of choices


### After Evaluations

1. **Export PDF reports** for documentation and approval workflows
2. **Review recommendations** with stakeholders
3. **Implement additional controls** for conditional approvals
4. **Monitor approved applications** for ongoing compliance


### For Consistent Results

- **Use the same evaluation approach** across similar applications
- **Document rationale** for scoring decisions
- **Regular training** on criteria interpretation
- **Periodic review** of evaluation outcomes


---

## Troubleshooting

### Common Issues

#### "Cannot export PDF"

- **Cause**: Evaluation not complete
- **Solution**: Ensure all criteria have been answered before exporting


#### "No selection made for criterion"

- **Cause**: Missing answers in evaluation
- **Solution**: Review all criteria and ensure radio button selections are made


#### "Platform type not found"

- **Cause**: Data synchronization issue
- **Solution**: Refresh the page and restart evaluation


#### Scores don't add up to expected total

- **Cause**: Weighted scoring system
- **Solution**: Remember that scores are weighted by criterion importance, not simple averages



### Getting Help

- **Review this guide** for detailed instructions
- **Check the Criteria Reference** for scoring explanations
- **Contact system administrators** for technical issues
- **Refer to organisational security policies** for evaluation guidance


---

## Quick Reference

### Evaluation Workflow

1. **Criteria Reference** → Review scoring guidelines
2. **Calculator** → Enter app details
3. **Calculator** → Complete security evaluation
4. **Export PDF** → Document results
5. **Risk Matrix** → Track trends and patterns


### Key Scoring Thresholds

- **80+**: Approve
- **60-79**: Approve with conditions
- **0-59**: Reject


### Priority Criterion

**"Internal Alternative Exists?"** appears first in all platform types - consider this fundamental question before proceeding with external application evaluation.

---

*This guide covers the essential functions of the MAXimum Security Priority Calculator. For additional support or advanced configuration options, consult your system administrator or security team.*



![image](https://github.com/user-attachments/assets/11003175-1bf4-439f-afdf-ad56cb7af7c9)



![image](https://github.com/user-attachments/assets/09ac648a-6fc1-4ee0-92b3-b368616b3f15)


![image](https://github.com/user-attachments/assets/1375c820-d070-4c95-befb-56c02800a8ff)

