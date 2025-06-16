"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { v4 as uuidv4 } from "uuid"
import type { PlatformType, Criterion, CriterionOption, AppRequest, CalculationResult } from "@/lib/types"

interface State {
  platformTypes: PlatformType[]
  appRequests: AppRequest[]
  addPlatformType: (platformType: Omit<PlatformType, "id">) => string
  updatePlatformType: (id: string, platformType: Partial<Omit<PlatformType, "id">>) => void
  deletePlatformType: (id: string) => void
  addCriterion: (platformTypeId: string, criterion: Omit<Criterion, "id">) => string
  updateCriterion: (platformTypeId: string, criterionId: string, criterion: Partial<Omit<Criterion, "id">>) => void
  deleteCriterion: (platformTypeId: string, criterionId: string) => void
  addCriterionOption: (platformTypeId: string, criterionId: string, option: Omit<CriterionOption, "id">) => string
  updateCriterionOption: (
    platformTypeId: string,
    criterionId: string,
    optionId: string,
    option: Partial<Omit<CriterionOption, "id">>,
  ) => void
  deleteCriterionOption: (platformTypeId: string, criterionId: string, optionId: string) => void
  normalizeCriteriaWeights: (platformTypeId: string) => void
  addAppRequest: (appRequest: Omit<AppRequest, "id" | "status" | "requestDate">) => string
  updateAppRequest: (id: string, appRequest: Partial<Omit<AppRequest, "id">>) => void
  deleteAppRequest: (id: string) => void
  calculateScore: (appRequestId: string, selections: Record<string, string>) => CalculationResult
}

// Enhanced SaaS criteria with detailed descriptions
const initialPlatformTypes: PlatformType[] = [
  {
    id: uuidv4(),
    name: "SaaS",
    description: "Software as a Service applications",
    criteria: [
      {
        id: uuidv4(),
        name: "Internal Alternative Exists?",
        description:
          "Assesses whether there is an existing internal solution, system, or capability that could meet the same business need as the requested external application. Having internal alternatives reduces dependency on external vendors, improves security control, and may provide cost benefits. Consider existing systems, in-house development capabilities, and alternative approaches to meeting the business requirement.",
        weight: 7,
        options: [
          {
            id: uuidv4(),
            label: "Yes, internal alternative available",
            value: 0,
            description: "Existing internal solution can meet the business need - external app not justified",
          },
          {
            id: uuidv4(),
            label: "No internal alternative available",
            value: 100,
            description: "No existing or feasible internal solution - external app is necessary",
          },
        ],
      },
      {
        id: uuidv4(),
        name: "Fits Business Strategy?",
        description:
          "Evaluates how well this application aligns with the organization's strategic objectives, digital transformation goals, and business priorities. Consider whether the application supports core business functions, enhances productivity, or enables new capabilities that are essential to business success. Applications that directly support strategic initiatives pose lower risk and provide higher value.",
        weight: 9,
        options: [
          {
            id: uuidv4(),
            label: "Fully aligned",
            value: 100,
            description: "Directly supports core strategic objectives and business priorities",
          },
          {
            id: uuidv4(),
            label: "No alignment",
            value: 0,
            description: "Does not support any identified business strategy or objectives",
          },
        ],
      },
      {
        id: uuidv4(),
        name: "Vendor on approved list?",
        description:
          "Assesses whether the vendor has undergone proper due diligence and security assessment by the organization. Approved vendors have been vetted for financial stability, security practices, compliance standards, and contractual terms. Using approved vendors reduces procurement risk and ensures established support channels.",
        weight: 7,
        options: [
          {
            id: uuidv4(),
            label: "Yes, fully approved",
            value: 100,
            description: "Vendor has completed full approval process and security assessment",
          },
          {
            id: uuidv4(),
            label: "Not approved",
            value: 0,
            description: "Vendor has not been assessed or has failed approval process",
          },
        ],
      },
      {
        id: uuidv4(),
        name: "Already marked as Sanctioned by?",
        description:
          "Determines the level of organizational approval and oversight for this application. Administrator-level sanctions indicate thorough security review and ongoing governance with elevated privileges, while general user sanctions provide basic approval but with limited oversight.",
        weight: 5,
        options: [
          {
            id: uuidv4(),
            label: "Administrator",
            value: 100,
            description: "Formally approved by administrator with elevated privileges and security controls validated",
          },
          {
            id: uuidv4(),
            label: "Non-administrator/General user",
            value: 0,
            description: "Approved by general user without administrative oversight or elevated security review",
          },
        ],
      },
      {
        id: uuidv4(),
        name: "Status",
        description:
          "Evaluates the approval and monitoring status of the application within the organization. Sanctioned applications have formal approval and security clearance, monitored applications are under active oversight, custom applications are internally developed, while unsanctioned applications pose significant security and compliance risks.",
        weight: 4,
        options: [
          {
            id: uuidv4(),
            label: "Sanctioned",
            value: 100,
            description: "Formally approved and sanctioned for organizational use with security clearance",
          },
          {
            id: uuidv4(),
            label: "Monitored",
            value: 70,
            description: "Under active monitoring and oversight with conditional approval",
          },
          {
            id: uuidv4(),
            label: "Custom app",
            value: 50,
            description: "Internally developed or customized application with known security controls",
          },
          {
            id: uuidv4(),
            label: "Unsanctioned",
            value: 0,
            description: "Not formally approved and poses significant security and compliance risks",
          },
        ],
      },
      {
        id: uuidv4(),
        name: "Risk score",
        description:
          "Overall risk assessment considering factors such as data sensitivity, business impact, technical complexity, and potential for security incidents. This score should reflect the comprehensive risk analysis performed by the security team, considering both likelihood and impact of potential issues.",
        weight: 14,
        options: [
          {
            id: uuidv4(),
            label: "Low risk (1-3)",
            value: 100,
            description: "Minimal risk to organization with strong controls and low impact",
          },
          {
            id: uuidv4(),
            label: "Medium risk (4-6)",
            value: 65,
            description: "Moderate risk requiring additional controls and monitoring",
          },
          {
            id: uuidv4(),
            label: "High risk (7-8)",
            value: 35,
            description: "Significant risk requiring extensive controls and executive approval",
          },
          {
            id: uuidv4(),
            label: "Critical risk (9-10)",
            value: 0,
            description: "Unacceptable risk level that could severely impact the organization",
          },
        ],
      },
      {
        id: uuidv4(),
        name: "Security risk factor",
        description:
          "Specific assessment of cybersecurity risks including data protection, access controls, encryption, vulnerability management, and incident response capabilities. Consider the application's security architecture, the vendor's security practices, and potential attack vectors.",
        weight: 14,
        options: [
          {
            id: uuidv4(),
            label: "Low security risk",
            value: 100,
            description: "Strong security controls, encryption, and proven security track record",
          },
          {
            id: uuidv4(),
            label: "Medium security risk",
            value: 65,
            description: "Adequate security controls with some areas for improvement",
          },
          {
            id: uuidv4(),
            label: "High security risk",
            value: 35,
            description: "Significant security concerns requiring additional protective measures",
          },
          {
            id: uuidv4(),
            label: "Critical security risk",
            value: 0,
            description: "Severe security vulnerabilities or inadequate security practices",
          },
        ],
      },
      {
        id: uuidv4(),
        name: "Compliance risk factor",
        description:
          "Assessment of regulatory and policy compliance including GDPR, industry standards, organizational policies, and audit requirements. Consider data handling practices, retention policies, access logging, and the vendor's compliance certifications and track record.",
        weight: 9,
        options: [
          {
            id: uuidv4(),
            label: "Fully compliant",
            value: 100,
            description: "Meets all applicable regulations and organizational policies",
          },
          {
            id: uuidv4(),
            label: "Minor compliance gaps",
            value: 70,
            description: "Small compliance issues that can be addressed with controls",
          },
          {
            id: uuidv4(),
            label: "Major compliance issues",
            value: 30,
            description: "Significant compliance concerns requiring substantial remediation",
          },
          {
            id: uuidv4(),
            label: "Non-compliant",
            value: 0,
            description: "Fails to meet critical regulatory or policy requirements",
          },
        ],
      },
      {
        id: uuidv4(),
        name: "Legal score",
        description:
          "Evaluation of legal risks including contract terms, liability provisions, data processing agreements, intellectual property concerns, and jurisdictional issues. Consider the vendor's legal standing, contract negotiability, and potential legal exposure for the organization.",
        weight: 7,
        options: [
          {
            id: uuidv4(),
            label: "Low legal risk",
            value: 100,
            description: "Favorable contract terms with appropriate liability protections",
          },
          {
            id: uuidv4(),
            label: "Medium legal risk",
            value: 65,
            description: "Standard contract terms with manageable legal exposure",
          },
          {
            id: uuidv4(),
            label: "High legal risk",
            value: 25,
            description: "Concerning contract terms or significant legal exposure",
          },
          {
            id: uuidv4(),
            label: "Critical legal risk",
            value: 0,
            description: "Unacceptable legal terms or severe legal exposure",
          },
        ],
      },
      {
        id: uuidv4(),
        name: "App last authorised date",
        description:
          "Indicates how recently the application has undergone security review and authorization. Regular reauthorization ensures that security controls remain current and that any changes to the application or threat landscape are properly assessed.",
        weight: 5,
        options: [
          {
            id: uuidv4(),
            label: "Within last 6 months",
            value: 100,
            description: "Recent authorization with current security assessment",
          },
          {
            id: uuidv4(),
            label: "6-12 months ago",
            value: 80,
            description: "Relatively recent authorization, may need review update",
          },
          {
            id: uuidv4(),
            label: "1-2 years ago",
            value: 40,
            description: "Outdated authorization requiring comprehensive review",
          },
          {
            id: uuidv4(),
            label: "Over 2 years or never",
            value: 0,
            description: "No recent authorization or never formally authorized",
          },
        ],
      },
      {
        id: uuidv4(),
        name: "App Supplier Domain/URL",
        description:
          "Evaluates the legitimacy and security of the vendor's web presence. Verified domains with proper security certificates indicate a professional, security-conscious vendor. Suspicious or unverified domains may indicate fraudulent or insecure services.",
        weight: 4,
        options: [
          {
            id: uuidv4(),
            label: "Verified secure domain",
            value: 100,
            description: "Legitimate domain with valid SSL certificate and security headers",
          },
          {
            id: uuidv4(),
            label: "Known domain, HTTPS",
            value: 75,
            description: "Recognized domain with basic HTTPS security",
          },
          {
            id: uuidv4(),
            label: "Unknown domain",
            value: 25,
            description: "Unfamiliar domain requiring additional verification",
          },
          {
            id: uuidv4(),
            label: "Suspicious/insecure domain",
            value: 0,
            description: "Domain appears fraudulent or lacks basic security measures",
          },
        ],
      },
      {
        id: uuidv4(),
        name: "Login URL",
        description:
          "Assesses the security of the authentication endpoint. Secure login URLs with valid certificates protect user credentials during authentication. Insecure login pages expose credentials to interception and compromise.",
        weight: 3,
        options: [
          {
            id: uuidv4(),
            label: "HTTPS with valid certificate",
            value: 100,
            description: "Secure login with proper SSL/TLS encryption and valid certificate",
          },
          {
            id: uuidv4(),
            label: "HTTPS with minor issues",
            value: 65,
            description: "Encrypted login with minor certificate or configuration issues",
          },
          {
            id: uuidv4(),
            label: "HTTP or certificate issues",
            value: 35,
            description: "Unencrypted login or significant certificate problems",
          },
          {
            id: uuidv4(),
            label: "Insecure or suspicious",
            value: 0,
            description: "Clearly insecure login or suspicious authentication mechanism",
          },
        ],
      },
      {
        id: uuidv4(),
        name: "Is AI or similar?",
        description:
          "Identifies applications using artificial intelligence, machine learning, or automated decision-making technologies. AI applications may pose additional risks related to data processing, algorithmic bias, transparency, and regulatory compliance (e.g., EU AI Act).",
        weight: 4,
        options: [
          {
            id: uuidv4(),
            label: "No AI/ML functionality",
            value: 100,
            description: "Traditional application without AI or machine learning components",
          },
          {
            id: uuidv4(),
            label: "Basic AI with transparency",
            value: 80,
            description: "Limited AI use with clear documentation and explainability",
          },
          {
            id: uuidv4(),
            label: "Advanced AI with controls",
            value: 40,
            description: "Significant AI functionality with appropriate governance controls",
          },
          {
            id: uuidv4(),
            label: "AI/ML with unknown risks",
            value: 0,
            description: "AI functionality without adequate transparency or risk assessment",
          },
        ],
      },
      {
        id: uuidv4(),
        name: "Data Center location",
        description:
          "Critical for data sovereignty and regulatory compliance. Data location affects legal jurisdiction, government access rights, privacy protections, and compliance with regulations like GDPR. UK and EU locations generally provide stronger privacy protections for UK organizations.",
        weight: 8,
        options: [
          {
            id: uuidv4(),
            label: "UK",
            value: 100,
            description: "Data stored exclusively in UK data centers under UK jurisdiction",
          },
          {
            id: uuidv4(),
            label: "EU/EEA",
            value: 80,
            description: "Data stored in European Union or European Economic Area",
          },
          {
            id: uuidv4(),
            label: "Non-UK, non-EU/EEA",
            value: 0,
            description: "Data stored in countries outside UK and EU/EEA with potentially weaker privacy protections",
          },
        ],
      },
    ],
  },
  {
    id: uuidv4(),
    name: "Locally Installed",
    description: "Applications installed on local devices",
    criteria: [
      {
        id: uuidv4(),
        name: "Internal Alternative Exists?",
        description:
          "Assesses whether there is an existing internal solution, system, or capability that could meet the same business need as the requested external application. Having internal alternatives reduces dependency on external vendors, improves security control, and may provide cost benefits. Consider existing systems, in-house development capabilities, and alternative approaches to meeting the business requirement.",
        weight: 20,
        options: [
          {
            id: uuidv4(),
            label: "Yes, internal alternative available",
            value: 0,
            description: "Existing internal solution can meet the business need - external app not justified",
          },
          {
            id: uuidv4(),
            label: "No internal alternative available",
            value: 100,
            description: "No existing or feasible internal solution - external app is necessary",
          },
        ],
      },
      {
        id: uuidv4(),
        name: "Vendor Reputation",
        description:
          "Assesses the trustworthiness and track record of the software vendor. Well-established vendors typically have better security practices, regular updates, and reliable support. Unknown vendors may pose higher risks due to unproven security practices or potential malicious intent.",
        weight: 20,
        options: [
          {
            id: uuidv4(),
            label: "Well-established",
            value: 100,
            description: "Recognized vendor with strong reputation and proven track record",
          },
          {
            id: uuidv4(),
            label: "Known",
            value: 60,
            description: "Familiar vendor with adequate reputation but limited track record",
          },
          {
            id: uuidv4(),
            label: "Unknown",
            value: 0,
            description: "Unfamiliar vendor with no established reputation or track record",
          },
        ],
      },
      {
        id: uuidv4(),
        name: "Installation Privileges",
        description:
          "Evaluates the level of system access required for installation. Applications requiring administrative privileges have greater potential to compromise system security, install malware, or access sensitive data. Standard user installations pose significantly lower risk.",
        weight: 20,
        options: [
          {
            id: uuidv4(),
            label: "Standard user",
            value: 100,
            description: "Can be installed with standard user privileges without admin access",
          },
          {
            id: uuidv4(),
            label: "Admin required",
            value: 40,
            description: "Requires administrative privileges for installation or operation",
          },
        ],
      },
      {
        id: uuidv4(),
        name: "Security Scan",
        description:
          "Indicates whether the application has been analyzed for malware, vulnerabilities, and security issues using automated scanning tools or manual security assessment. Clean scans provide confidence in the application's security posture.",
        weight: 20,
        options: [
          {
            id: uuidv4(),
            label: "Yes, clean",
            value: 100,
            description: "Comprehensive security scan completed with no issues identified",
          },
          {
            id: uuidv4(),
            label: "Yes, minor issues",
            value: 60,
            description: "Security scan completed with minor, manageable issues identified",
          },
          {
            id: uuidv4(),
            label: "Yes, major issues",
            value: 20,
            description: "Security scan revealed significant security concerns",
          },
          { id: uuidv4(), label: "No", value: 0, description: "No security scanning has been performed" },
        ],
      },
      {
        id: uuidv4(),
        name: "Business Need",
        description:
          "Assesses the importance and urgency of the business requirement that this application addresses. Critical business needs may justify accepting higher risks, while applications without clear business value should be rejected regardless of security posture.",
        weight: 20,
        options: [
          {
            id: uuidv4(),
            label: "Yes, critical",
            value: 100,
            description: "Essential for critical business operations or regulatory compliance",
          },
          {
            id: uuidv4(),
            label: "Yes, important",
            value: 80,
            description: "Supports important business functions or significant productivity gains",
          },
          {
            id: uuidv4(),
            label: "Yes, useful",
            value: 60,
            description: "Provides useful functionality but not essential for operations",
          },
          { id: uuidv4(), label: "No", value: 0, description: "No clear business justification or need identified" },
        ],
      },
    ],
  },
  {
    id: uuidv4(),
    name: "OAuth",
    description: "Applications using OAuth for authorization",
    criteria: [
      {
        id: uuidv4(),
        name: "Internal Alternative Exists?",
        description:
          "Assesses whether there is an existing internal solution, system, or capability that could meet the same business need as the requested external application. Having internal alternatives reduces dependency on external vendors, improves security control, and may provide cost benefits. Consider existing systems, in-house development capabilities, and alternative approaches to meeting the business requirement.",
        weight: 20,
        options: [
          {
            id: uuidv4(),
            label: "Yes, internal alternative available",
            value: 0,
            description: "Existing internal solution can meet the business need - external app not justified",
          },
          {
            id: uuidv4(),
            label: "No internal alternative available",
            value: 100,
            description: "No existing or feasible internal solution - external app is necessary",
          },
        ],
      },
      {
        id: uuidv4(),
        name: "Permissions Scope",
        description:
          "Evaluates the extent of access permissions requested by the application. Read-only access poses minimal risk, while full access permissions could allow the application to modify or delete critical data. The principle of least privilege should guide permission grants.",
        weight: 24,
        options: [
          {
            id: uuidv4(),
            label: "Read-only",
            value: 100,
            description: "Application requests only read access to data",
          },
          {
            id: uuidv4(),
            label: "Limited write",
            value: 65,
            description: "Application requests limited write permissions to specific data types",
          },
          {
            id: uuidv4(),
            label: "Full access",
            value: 0,
            description: "Application requests comprehensive read and write access to all data",
          },
        ],
      },
      {
        id: uuidv4(),
        name: "App Verification",
        description:
          "Indicates whether the application has been verified by the OAuth provider (e.g., Google, Microsoft). Verified applications have undergone security review and identity verification by the platform provider, reducing the risk of malicious applications.",
        weight: 20,
        options: [
          {
            id: uuidv4(),
            label: "Yes",
            value: 100,
            description: "Application has been verified by the OAuth provider",
          },
          {
            id: uuidv4(),
            label: "No",
            value: 0,
            description: "Application has not undergone provider verification process",
          },
        ],
      },
      {
        id: uuidv4(),
        name: "User Base",
        description:
          "Assesses the scope of potential impact based on the number of users who will use the application. Single-user applications limit exposure, while organization-wide deployments could affect all users if the application is compromised.",
        weight: 16,
        options: [
          {
            id: uuidv4(),
            label: "Single user",
            value: 100,
            description: "Application will be used by only one individual",
          },
          {
            id: uuidv4(),
            label: "Department",
            value: 50,
            description: "Application will be used by a specific department or team",
          },
          {
            id: uuidv4(),
            label: "Organization-wide",
            value: 25,
            description: "Application will be deployed across the entire organization",
          },
        ],
      },
      {
        id: uuidv4(),
        name: "Data Access",
        description:
          "Evaluates the sensitivity level of data that the application will access. Public data poses minimal risk, while access to restricted or confidential data could result in significant data breaches if the application is compromised.",
        weight: 20,
        options: [
          {
            id: uuidv4(),
            label: "Public only",
            value: 100,
            description: "Application accesses only publicly available information",
          },
          {
            id: uuidv4(),
            label: "Internal",
            value: 60,
            description: "Application accesses internal business data not publicly available",
          },
          {
            id: uuidv4(),
            label: "Confidential",
            value: 20,
            description: "Application accesses confidential or sensitive business data",
          },
          {
            id: uuidv4(),
            label: "Restricted",
            value: 0,
            description: "Application accesses highly restricted or regulated data",
          },
        ],
      },
    ],
  },
  {
    id: uuidv4(),
    name: "Plugins",
    description: "Browser extensions, IDE plugins, and application add-ons",
    criteria: [
      {
        id: uuidv4(),
        name: "Internal Alternative Exists?",
        description:
          "Assesses whether there is an existing internal solution, system, or capability that could meet the same business need as the requested external application. Having internal alternatives reduces dependency on external vendors, improves security control, and may provide cost benefits. Consider existing systems, in-house development capabilities, and alternative approaches to meeting the business requirement.",
        weight: 12,
        options: [
          {
            id: uuidv4(),
            label: "Yes, internal alternative available",
            value: 0,
            description: "Existing internal solution can meet the business need - external app not justified",
          },
          {
            id: uuidv4(),
            label: "No internal alternative available",
            value: 100,
            description: "No existing or feasible internal solution - external app is necessary",
          },
        ],
      },
      {
        id: uuidv4(),
        name: "Permissions Requested",
        description:
          "Evaluates the scope and sensitivity of permissions requested by the plugin. Plugins with minimal permissions pose lower risk, while those requesting broad access to data, network, or system resources require careful evaluation. Follow the principle of least privilege.",
        weight: 26,
        options: [
          {
            id: uuidv4(),
            label: "Minimal permissions",
            value: 100,
            description: "Plugin requests only essential permissions for basic functionality",
          },
          {
            id: uuidv4(),
            label: "Standard permissions",
            value: 75,
            description: "Plugin requests typical permissions for its category and functionality",
          },
          {
            id: uuidv4(),
            label: "Elevated permissions",
            value: 40,
            description: "Plugin requests broad permissions including network access or data modification",
          },
          {
            id: uuidv4(),
            label: "Excessive permissions",
            value: 0,
            description: "Plugin requests unnecessary or overly broad permissions that exceed functional needs",
          },
        ],
      },
      {
        id: uuidv4(),
        name: "Developer Reputation",
        description:
          "Assesses the trustworthiness and track record of the plugin developer or organization. Established developers with good reputations and multiple quality plugins pose lower risk than unknown or new developers with limited history.",
        weight: 13,
        options: [
          {
            id: uuidv4(),
            label: "Well-known developer",
            value: 100,
            description: "Recognized developer or organization with strong reputation and track record",
          },
          {
            id: uuidv4(),
            label: "Established developer",
            value: 80,
            description: "Developer with good reputation and several published plugins",
          },
          {
            id: uuidv4(),
            label: "New/unknown developer",
            value: 40,
            description: "Developer with limited history or unknown reputation",
          },
          {
            id: uuidv4(),
            label: "Suspicious developer",
            value: 0,
            description: "Developer with concerning history or suspicious characteristics",
          },
        ],
      },
      {
        id: uuidv4(),
        name: "Data Access Level",
        description:
          "Evaluates what type of data the plugin can access and process. Plugins accessing sensitive business data, personal information, or system credentials pose higher risks than those working with public or non-sensitive data.",
        weight: 22,
        options: [
          {
            id: uuidv4(),
            label: "No data access",
            value: 100,
            description: "Plugin operates without accessing user or system data",
          },
          {
            id: uuidv4(),
            label: "Public data only",
            value: 85,
            description: "Plugin accesses only publicly available information",
          },
          {
            id: uuidv4(),
            label: "Internal data",
            value: 50,
            description: "Plugin accesses internal business data or user information",
          },
          {
            id: uuidv4(),
            label: "Sensitive/credential data",
            value: 0,
            description: "Plugin accesses sensitive data, credentials, or highly confidential information",
          },
        ],
      },
      {
        id: uuidv4(),
        name: "Update Frequency",
        description:
          "Assesses how regularly the plugin is maintained and updated. Regular updates indicate active maintenance, security patching, and ongoing support. Abandoned or rarely updated plugins may contain unpatched vulnerabilities.",
        weight: 9,
        options: [
          {
            id: uuidv4(),
            label: "Regular updates (monthly)",
            value: 100,
            description: "Plugin is actively maintained with regular updates and security patches",
          },
          {
            id: uuidv4(),
            label: "Periodic updates (quarterly)",
            value: 80,
            description: "Plugin receives periodic updates and maintenance",
          },
          {
            id: uuidv4(),
            label: "Infrequent updates (yearly)",
            value: 40,
            description: "Plugin is updated infrequently, may have delayed security patches",
          },
          {
            id: uuidv4(),
            label: "No recent updates",
            value: 0,
            description: "Plugin appears abandoned with no recent updates or maintenance",
          },
        ],
      },
      {
        id: uuidv4(),
        name: "Business Justification",
        description:
          "Evaluates the business need and value provided by the plugin. Strong business justification may warrant accepting higher risks, while plugins without clear business value should be rejected regardless of security posture.",
        weight: 9,
        options: [
          {
            id: uuidv4(),
            label: "Critical business need",
            value: 100,
            description: "Plugin is essential for critical business operations or compliance requirements",
          },
          {
            id: uuidv4(),
            label: "Important productivity gain",
            value: 80,
            description: "Plugin provides significant productivity improvements or workflow enhancements",
          },
          {
            id: uuidv4(),
            label: "Useful but not essential",
            value: 60,
            description: "Plugin offers useful functionality but is not critical for operations",
          },
          {
            id: uuidv4(),
            label: "No clear business value",
            value: 0,
            description: "Plugin provides no clear business benefit or justification",
          },
        ],
      },
      {
        id: uuidv4(),
        name: "App Source and Publisher Verification",
        description:
          "Comprehensive verification of the app publisher's identity and reputation. This includes checking if the app is from Microsoft AppSource or a trusted third-party developer, reviewing the app's security certifications and compliance attestations, and validating digital signatures and certificates. Proper publisher verification reduces the risk of malicious or compromised plugins.",
        weight: 9,
        options: [
          {
            id: uuidv4(),
            label: "Fully verified publisher",
            value: 100,
            description:
              "Publisher identity verified, from trusted source (e.g., Microsoft AppSource), with valid certificates and security attestations",
          },
          {
            id: uuidv4(),
            label: "Verified with minor gaps",
            value: 75,
            description: "Publisher mostly verified but missing some certifications or attestations",
          },
          {
            id: uuidv4(),
            label: "Partially verified",
            value: 40,
            description:
              "Some publisher verification completed but significant gaps in identity or security validation",
          },
          {
            id: uuidv4(),
            label: "Unverified publisher",
            value: 0,
            description:
              "Publisher identity not verified, no security certifications, or invalid/missing digital signatures",
          },
        ],
      },
    ],
  },
  {
    id: uuidv4(),
    name: "Whitelisting websites",
    description: "Requests to whitelist blocked websites and domains",
    criteria: [
      {
        id: uuidv4(),
        name: "Probably misclassified and therefore blocked incorrectly?",
        description:
          "Assesses whether the website appears to have been incorrectly categorized or blocked by automated systems. Legitimate business websites may sometimes be misclassified due to content analysis errors, domain reputation issues, or false positives in security scanning. Consider the website's actual content, purpose, and legitimacy versus the stated blocking reason.",
        weight: 35,
        options: [
          {
            id: uuidv4(),
            label: "Yes, clearly misclassified",
            value: 100,
            description: "Website is legitimate and appears to be incorrectly blocked due to classification error",
          },
          {
            id: uuidv4(),
            label: "Possibly misclassified",
            value: 70,
            description: "Website may be legitimate but classification is unclear or borderline",
          },
          {
            id: uuidv4(),
            label: "Correctly classified",
            value: 0,
            description: "Website appears to be correctly blocked based on its content or category",
          },
        ],
      },
      {
        id: uuidv4(),
        name: "Was blocked by tool due to security reasons?",
        description:
          "Determines if the website was blocked specifically due to security concerns such as malware, phishing, suspicious activity, or known threats. Security-based blocks require careful evaluation as they may indicate genuine risks that could compromise organizational security if the site is whitelisted.",
        weight: 40,
        options: [
          {
            id: uuidv4(),
            label: "No security concerns",
            value: 100,
            description: "Website was not blocked for security reasons - blocked for policy or category reasons only",
          },
          {
            id: uuidv4(),
            label: "Minor security flags",
            value: 60,
            description: "Website has minor security concerns that may be false positives or low risk",
          },
          {
            id: uuidv4(),
            label: "Significant security concerns",
            value: 20,
            description: "Website was blocked due to confirmed security threats or suspicious activity",
          },
          {
            id: uuidv4(),
            label: "Known malicious site",
            value: 0,
            description: "Website is known to host malware, phishing, or other malicious content",
          },
        ],
      },
      {
        id: uuidv4(),
        name: "Has a Business Justification?",
        description:
          "Evaluates whether there is a legitimate business need for accessing this website. Strong business justification is essential for whitelisting requests, as it helps balance security risks against operational requirements. Consider the business impact of continued blocking versus the potential security risks of allowing access.",
        weight: 25,
        options: [
          {
            id: uuidv4(),
            label: "Critical business need",
            value: 100,
            description:
              "Website access is essential for critical business operations, compliance, or customer service",
          },
          {
            id: uuidv4(),
            label: "Important business need",
            value: 80,
            description: "Website supports important business functions or provides significant operational value",
          },
          {
            id: uuidv4(),
            label: "Minor business benefit",
            value: 40,
            description: "Website provides some business value but is not essential for operations",
          },
          {
            id: uuidv4(),
            label: "No clear business justification",
            value: 0,
            description: "No legitimate business reason identified for accessing this website",
          },
        ],
      },
    ],
  },
]

// Function to move "Internal Alternative Exists?" to the beginning of criteria
const moveInternalAlternativeCriterion = (platformType: PlatformType): PlatformType => {
  const internalAlternativeCriterionIndex = platformType.criteria.findIndex(
    (criterion) => criterion.name === "Internal Alternative Exists?",
  )

  if (internalAlternativeCriterionIndex === -1) {
    return platformType // Criterion not found, return original platform type
  }

  const internalAlternativeCriterion = platformType.criteria.splice(internalAlternativeCriterionIndex, 1)[0]

  platformType.criteria.unshift(internalAlternativeCriterion)
  return platformType
}

const updatedInitialPlatformTypes = initialPlatformTypes.map((platformType) =>
  moveInternalAlternativeCriterion(platformType),
)

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      platformTypes: updatedInitialPlatformTypes,
      appRequests: [],

      addPlatformType: (platformType) => {
        const id = uuidv4()
        set((state) => ({
          platformTypes: [...state.platformTypes, { ...platformType, id, criteria: [] }],
        }))
        return id
      },

      updatePlatformType: (id, platformType) => {
        set((state) => ({
          platformTypes: state.platformTypes.map((pt) => (pt.id === id ? { ...pt, ...platformType } : pt)),
        }))
      },

      deletePlatformType: (id) => {
        set((state) => ({
          platformTypes: state.platformTypes.filter((pt) => pt.id !== id),
        }))
      },

      addCriterion: (platformTypeId, criterion) => {
        const id = uuidv4()
        set((state) => ({
          platformTypes: state.platformTypes.map((pt) =>
            pt.id === platformTypeId
              ? {
                  ...pt,
                  criteria: [...pt.criteria, { ...criterion, id, options: [] }],
                }
              : pt,
          ),
        }))
        get().normalizeCriteriaWeights(platformTypeId)
        return id
      },

      updateCriterion: (platformTypeId, criterionId, criterion) => {
        set((state) => ({
          platformTypes: state.platformTypes.map((pt) =>
            pt.id === platformTypeId
              ? {
                  ...pt,
                  criteria: pt.criteria.map((c) => (c.id === criterionId ? { ...c, ...criterion } : c)),
                }
              : pt,
          ),
        }))
        get().normalizeCriteriaWeights(platformTypeId)
      },

      deleteCriterion: (platformTypeId, criterionId) => {
        set((state) => ({
          platformTypes: state.platformTypes.map((pt) =>
            pt.id === platformTypeId
              ? {
                  ...pt,
                  criteria: pt.criteria.filter((c) => c.id !== criterionId),
                }
              : pt,
          ),
        }))
        get().normalizeCriteriaWeights(platformTypeId)
      },

      addCriterionOption: (platformTypeId, criterionId, option) => {
        const id = uuidv4()
        set((state) => ({
          platformTypes: state.platformTypes.map((pt) =>
            pt.id === platformTypeId
              ? {
                  ...pt,
                  criteria: pt.criteria.map((c) =>
                    c.id === criterionId
                      ? {
                          ...c,
                          options: [...c.options, { ...option, id }],
                        }
                      : c,
                  ),
                }
              : pt,
          ),
        }))
        return id
      },

      updateCriterionOption: (platformTypeId, criterionId, optionId, option) => {
        set((state) => ({
          platformTypes: state.platformTypes.map((pt) =>
            pt.id === platformTypeId
              ? {
                  ...pt,
                  criteria: pt.criteria.map((c) =>
                    c.id === criterionId
                      ? {
                          ...c,
                          options: c.options.map((o) => (o.id === optionId ? { ...o, ...option } : o)),
                        }
                      : c,
                  ),
                }
              : pt,
          ),
        }))
      },

      deleteCriterionOption: (platformTypeId, criterionId, optionId) => {
        set((state) => ({
          platformTypes: state.platformTypes.map((pt) =>
            pt.id === platformTypeId
              ? {
                  ...pt,
                  criteria: pt.criteria.map((c) =>
                    c.id === criterionId
                      ? {
                          ...c,
                          options: c.options.filter((o) => o.id !== optionId),
                        }
                      : c,
                  ),
                }
              : pt,
          ),
        }))
      },

      normalizeCriteriaWeights: (platformTypeId) => {
        const { platformTypes } = get()
        const platformType = platformTypes.find((pt) => pt.id === platformTypeId)

        if (!platformType || platformType.criteria.length === 0) return

        const totalWeight = platformType.criteria.reduce((sum, criterion) => sum + criterion.weight, 0)

        if (totalWeight === 0) {
          // If total weight is 0, distribute evenly
          const equalWeight = 100 / platformType.criteria.length
          set((state) => ({
            platformTypes: state.platformTypes.map((pt) =>
              pt.id === platformTypeId
                ? {
                    ...pt,
                    criteria: pt.criteria.map((c) => ({
                      ...c,
                      weight: equalWeight,
                    })),
                  }
                : pt,
            ),
          }))
        } else if (totalWeight !== 100) {
          // Normalize weights to sum to 100
          const factor = 100 / totalWeight
          set((state) => ({
            platformTypes: state.platformTypes.map((pt) =>
              pt.id === platformTypeId
                ? {
                    ...pt,
                    criteria: pt.criteria.map((c) => ({
                      ...c,
                      weight: Math.round(c.weight * factor),
                    })),
                  }
                : pt,
            ),
          }))
        }
      },

      addAppRequest: (appRequest) => {
        const id = uuidv4()
        set((state) => ({
          appRequests: [
            ...state.appRequests,
            {
              ...appRequest,
              id,
              status: "pending",
              requestDate: new Date().toISOString(),
            },
          ],
        }))
        return id
      },

      updateAppRequest: (id, appRequest) => {
        set((state) => ({
          appRequests: state.appRequests.map((ar) => (ar.id === id ? { ...ar, ...appRequest } : ar)),
        }))
      },

      deleteAppRequest: (id) => {
        set((state) => ({
          appRequests: state.appRequests.filter((ar) => ar.id !== id),
        }))
      },

      calculateScore: (appRequestId, selections) => {
        const { appRequests, platformTypes } = get()
        const appRequest = appRequests.find((ar) => ar.id === appRequestId)

        if (!appRequest) {
          throw new Error("App request not found")
        }

        const platformType = platformTypes.find((pt) => pt.id === appRequest.platformTypeId)

        if (!platformType) {
          throw new Error("Platform type not found")
        }

        const criteriaScores = platformType.criteria.map((criterion) => {
          const selectedOptionId = selections[criterion.id]
          const selectedOption = criterion.options.find((o) => o.id === selectedOptionId)

          if (!selectedOption) {
            throw new Error(`No selection made for criterion: ${criterion.name}`)
          }

          const weightedScore = (selectedOption.value / 100) * criterion.weight

          return {
            criterionId: criterion.id,
            criterionName: criterion.name,
            weight: criterion.weight,
            selectedOption,
            weightedScore,
          }
        })

        const totalScore = criteriaScores.reduce((sum, { weightedScore }) => sum + weightedScore, 0)

        let recommendation = ""
        if (totalScore >= 80) {
          recommendation = "Approve"
        } else if (totalScore >= 60) {
          recommendation = "Approve with conditions"
        } else {
          recommendation = "Reject"
        }

        const result = {
          criteriaScores,
          totalScore,
          recommendation,
          platformType,
        }

        // Update the app request with the calculation result
        set((state) => ({
          appRequests: state.appRequests.map((ar) =>
            ar.id === appRequestId ? { ...ar, calculationResult: result } : ar,
          ),
        }))

        return result
      },
    }),
    {
      name: "max-security-calculator-storage",
    },
  ),
)
