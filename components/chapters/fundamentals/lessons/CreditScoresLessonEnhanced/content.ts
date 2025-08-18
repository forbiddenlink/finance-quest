import { CreditScoreContent } from './types';

export const content: CreditScoreContent = {
  introduction: {
    title: "Understanding Credit Scores & Reports",
    description: "Your credit score is a crucial financial metric that affects your ability to access loans, credit cards, and even employment opportunities. Understanding how credit scores work and how to manage your credit report is essential for financial success.",
    keyPoints: [
      "Credit scores range from 300 to 850, with higher scores indicating better creditworthiness",
      "Five main factors influence your credit score: payment history, credit utilization, length of credit history, credit mix, and new credit",
      "Credit reports contain detailed information about your credit accounts, payment history, and public records",
      "Regular monitoring and proactive management can help improve and maintain a good credit score"
    ]
  },
  creditScoreFactors: [
    {
      name: "Payment History",
      weight: 35,
      description: "Your track record of paying bills on time, including credit cards, loans, and other debt obligations.",
      bestPractices: [
        "Set up automatic payments",
        "Pay at least the minimum amount due",
        "Keep track of all due dates",
        "Address any missed payments immediately"
      ],
      commonMistakes: [
        "Forgetting due dates",
        "Assuming grace periods don't affect credit",
        "Not communicating with creditors when having payment difficulties"
      ],
      timeToImpact: "Immediate for missed payments",
      recoveryTime: "7 years for late payments"
    },
    {
      name: "Credit Utilization",
      weight: 30,
      description: "The amount of credit you're using compared to your credit limits.",
      bestPractices: [
        "Keep utilization below 30%",
        "Consider requesting credit limit increases",
        "Pay balances multiple times per month",
        "Keep old accounts open to maintain available credit"
      ],
      commonMistakes: [
        "Maxing out credit cards",
        "Closing old credit cards",
        "Only looking at individual card utilization"
      ],
      timeToImpact: "1-2 billing cycles",
      recoveryTime: "1-3 months"
    },
    {
      name: "Length of Credit History",
      weight: 15,
      description: "How long you've been using credit, including the age of your oldest and newest accounts.",
      bestPractices: [
        "Keep oldest accounts active",
        "Use older cards periodically",
        "Think carefully before closing accounts",
        "Start building credit early"
      ],
      commonMistakes: [
        "Closing old credit cards",
        "Opening too many new accounts",
        "Not using older accounts"
      ],
      timeToImpact: "Builds gradually over time",
      recoveryTime: "Cannot be expedited"
    },
    {
      name: "Credit Mix",
      weight: 10,
      description: "The variety of credit types you have, including revolving credit and installment loans.",
      bestPractices: [
        "Maintain a mix of credit types",
        "Only open accounts you need",
        "Consider secured loans or credit cards",
        "Monitor all accounts regularly"
      ],
      commonMistakes: [
        "Having only one type of credit",
        "Opening accounts just for mix",
        "Not understanding different credit types"
      ],
      timeToImpact: "3-6 months",
      recoveryTime: "6-12 months"
    },
    {
      name: "New Credit",
      weight: 10,
      description: "Recent credit applications and opened accounts.",
      bestPractices: [
        "Space out credit applications",
        "Research before applying",
        "Shop for rates within 14-45 days",
        "Only apply when necessary"
      ],
      commonMistakes: [
        "Multiple applications in short time",
        "Applying for credit you're unlikely to get",
        "Not checking pre-qualification options"
      ],
      timeToImpact: "Immediate for hard inquiries",
      recoveryTime: "2 years for inquiries"
    }
  ],
  creditBureaus: [
    {
      name: "Equifax",
      website: "www.equifax.com",
      reportFrequency: "Once every 12 months free",
      uniqueFeatures: [
        "Work Number employment verification",
        "Credit score monitoring",
        "Identity theft protection",
        "Credit lock features"
      ],
      scoringModel: "FICO Score 8",
      scoreRange: {
        min: 300,
        max: 850
      }
    },
    {
      name: "Experian",
      website: "www.experian.com",
      reportFrequency: "Once every 12 months free",
      uniqueFeatures: [
        "Experian Boost",
        "FICO Score 8 access",
        "Dark web monitoring",
        "Credit matching services"
      ],
      scoringModel: "FICO Score 8",
      scoreRange: {
        min: 300,
        max: 850
      }
    },
    {
      name: "TransUnion",
      website: "www.transunion.com",
      reportFrequency: "Once every 12 months free",
      uniqueFeatures: [
        "CreditView Dashboard",
        "Credit Lock Plus",
        "Score simulator",
        "TrueIdentity free identity protection"
      ],
      scoringModel: "VantageScore 3.0",
      scoreRange: {
        min: 300,
        max: 850
      }
    }
  ],
  disputeProcess: [
    {
      step: 1,
      name: "Review Your Credit Reports",
      description: "Obtain and carefully review your credit reports from all three bureaus.",
      timeframe: "1-2 days",
      requirements: [
        "Valid identification",
        "Social Security number",
        "Current address",
        "Previous addresses (if applicable)"
      ],
      tips: [
        "Use AnnualCreditReport.com for free reports",
        "Mark all questionable items",
        "Keep copies of your reports",
        "Note differences between bureaus"
      ]
    },
    {
      step: 2,
      name: "Gather Supporting Documentation",
      description: "Collect all documents that support your dispute claim.",
      timeframe: "1-2 weeks",
      requirements: [
        "Account statements",
        "Payment records",
        "Correspondence with creditors",
        "Court documents (if applicable)"
      ],
      tips: [
        "Organize documents by date",
        "Make copies of everything",
        "Highlight relevant information",
        "Create a dispute file"
      ]
    },
    {
      step: 3,
      name: "File the Dispute",
      description: "Submit your dispute to the credit bureaus and/or creditors.",
      timeframe: "30-45 days for investigation",
      requirements: [
        "Dispute letter",
        "Copy of credit report with items marked",
        "Supporting documentation",
        "Contact information"
      ],
      tips: [
        "Use certified mail",
        "Keep proof of submission",
        "Be clear and concise",
        "Follow up regularly"
      ]
    },
    {
      step: 4,
      name: "Follow Up and Review Results",
      description: "Monitor the investigation and review the results.",
      timeframe: "5-10 days after investigation",
      requirements: [
        "Investigation results",
        "Updated credit report",
        "Any additional correspondence"
      ],
      tips: [
        "Check all changes carefully",
        "Request reinvestigation if needed",
        "Keep all documentation",
        "Monitor credit report regularly"
      ]
    }
  ],
  creditMilestones: [
    {
      score: 580,
      benefits: [
        "Qualify for FHA loans with 10% down",
        "Access to secured credit cards",
        "Some subprime credit card options"
      ],
      requirements: [
        "No recent bankruptcies",
        "Limited recent late payments",
        "Some credit history"
      ],
      nextSteps: [
        "Apply for a secured credit card",
        "Maintain perfect payment history",
        "Keep credit utilization low"
      ]
    },
    {
      score: 640,
      benefits: [
        "Qualify for FHA loans with 3.5% down",
        "Access to better credit card options",
        "Lower security deposits on utilities"
      ],
      requirements: [
        "12 months of good payment history",
        "Credit utilization below 50%",
        "Limited new credit applications"
      ],
      nextSteps: [
        "Apply for a rewards credit card",
        "Request credit limit increases",
        "Consider a credit-builder loan"
      ]
    },
    {
      score: 700,
      benefits: [
        "Access to premium credit cards",
        "Better interest rates on loans",
        "Qualify for conventional mortgages"
      ],
      requirements: [
        "24 months of perfect payment history",
        "Credit utilization below 30%",
        "Diverse credit mix"
      ],
      nextSteps: [
        "Shop for better credit card rewards",
        "Refinance existing loans",
        "Monitor for identity theft"
      ]
    },
    {
      score: 760,
      benefits: [
        "Best available interest rates",
        "Premium credit card benefits",
        "Automatic credit limit increases"
      ],
      requirements: [
        "36+ months perfect payment history",
        "Credit utilization below 10%",
        "Long credit history"
      ],
      nextSteps: [
        "Maintain current habits",
        "Consider balance transfer offers",
        "Monitor credit regularly"
      ]
    }
  ],
  protectionTips: [
    {
      category: "Identity Theft Prevention",
      description: "Protect your personal information and monitor for suspicious activity.",
      implementation: [
        "Use strong, unique passwords",
        "Enable two-factor authentication",
        "Regularly check credit reports",
        "Set up fraud alerts"
      ],
      frequency: "Daily/Weekly monitoring",
      importance: "high"
    },
    {
      category: "Credit Freeze",
      description: "Prevent new accounts from being opened in your name.",
      implementation: [
        "Contact all three credit bureaus",
        "Keep PINs in a secure location",
        "Temporarily lift when applying for credit",
        "Refreeze after credit applications"
      ],
      frequency: "As needed",
      importance: "high"
    },
    {
      category: "Account Monitoring",
      description: "Regular review of all credit accounts and statements.",
      implementation: [
        "Review monthly statements",
        "Set up account alerts",
        "Monitor credit score changes",
        "Check for unauthorized charges"
      ],
      frequency: "Monthly",
      importance: "medium"
    },
    {
      category: "Information Security",
      description: "Protect physical and digital financial information.",
      implementation: [
        "Shred financial documents",
        "Use secure websites for transactions",
        "Avoid public Wi-Fi for banking",
        "Keep software updated"
      ],
      frequency: "Ongoing",
      importance: "high"
    }
  ],
  conclusion: {
    summary: [
      "Your credit score is a vital financial tool that requires active management",
      "Regular monitoring and quick action on discrepancies can prevent long-term damage",
      "Building good credit takes time but follows predictable patterns",
      "Protection against identity theft and fraud is essential"
    ],
    actionItems: [
      "Set up credit monitoring",
      "Create a payment calendar",
      "Review credit reports quarterly",
      "Implement security measures"
    ],
    resources: [
      {
        name: "Annual Credit Report",
        url: "www.annualcreditreport.com",
        description: "Official site for free credit reports"
      },
      {
        name: "CFPB Credit Resources",
        url: "www.consumerfinance.gov/consumer-tools/credit-reports-and-scores/",
        description: "Government resources on credit reporting"
      },
      {
        name: "FTC Identity Theft",
        url: "www.identitytheft.gov",
        description: "Official site for identity theft reporting and recovery"
      }
    ]
  }
};
