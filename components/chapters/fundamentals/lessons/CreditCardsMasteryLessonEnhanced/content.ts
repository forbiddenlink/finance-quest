import { LessonContent } from './types';

export const LESSON_CONTENT: LessonContent = {
  introduction: {
    title: "Understanding Credit Cards and Mastering Their Use",
    content: "Credit cards are powerful financial tools that, when used wisely, can help build credit, earn rewards, and provide financial flexibility. However, they require careful management and understanding to avoid common pitfalls.",
    keyPoints: [
      "Credit cards are a form of revolving credit",
      "They can help build credit history when used responsibly",
      "Different cards offer various benefits and features",
      "Understanding terms and fees is crucial"
    ]
  },
  creditCardTypes: {
    section: {
      title: "Types of Credit Cards",
      content: "Credit cards come in various types, each designed for specific purposes and user needs. Understanding these differences helps in choosing the right card for your situation.",
      keyPoints: [
        "Different cards serve different purposes",
        "Benefits and features vary by card type",
        "Annual fees often correlate with benefits",
        "Credit requirements vary by card type"
      ]
    },
    types: [
      {
        name: "Rewards Credit Cards",
        description: "Cards that offer points, miles, or cash back on purchases",
        benefits: [
          "Earn rewards on everyday spending",
          "Often include sign-up bonuses",
          "Additional perks like travel insurance",
          "Potential for significant value through strategic use"
        ],
        drawbacks: [
          "Usually require good to excellent credit",
          "May have high annual fees",
          "Higher interest rates than basic cards",
          "Complex rewards structures"
        ],
        bestFor: [
          "Regular credit card users",
          "Those who pay balances in full",
          "Travelers and frequent shoppers",
          "People who can maximize rewards"
        ],
        typicalFeatures: {
          annualFee: "$0-$550",
          rewardsRate: "1-5% or 1-5x points",
          introAPR: "0% for 12-18 months",
          creditScoreNeeded: "670+"
        }
      },
      {
        name: "Low Interest Credit Cards",
        description: "Cards with lower ongoing APRs or long 0% intro periods",
        benefits: [
          "Lower interest rates than rewards cards",
          "Good for carrying balances occasionally",
          "Often have 0% intro APR offers",
          "Usually no annual fee"
        ],
        drawbacks: [
          "Few or no rewards",
          "Limited additional benefits",
          "May still have high rates compared to loans",
          "May require good credit"
        ],
        bestFor: [
          "Those who occasionally carry balances",
          "People making large purchases",
          "Balance transfer candidates",
          "Those prioritizing low costs over rewards"
        ],
        typicalFeatures: {
          annualFee: "$0",
          rewardsRate: "None or minimal",
          introAPR: "0% for 15-21 months",
          creditScoreNeeded: "670+"
        }
      },
      {
        name: "Secured Credit Cards",
        description: "Cards requiring a security deposit that acts as the credit limit",
        benefits: [
          "Easier approval than unsecured cards",
          "Help build or rebuild credit",
          "Security deposit is refundable",
          "May graduate to unsecured card"
        ],
        drawbacks: [
          "Requires upfront deposit",
          "Usually low credit limits",
          "Few rewards or benefits",
          "May have annual fees"
        ],
        bestFor: [
          "Credit beginners",
          "Those rebuilding credit",
          "Students without credit history",
          "People with recent financial difficulties"
        ],
        typicalFeatures: {
          annualFee: "$0-$49",
          rewardsRate: "None or up to 1%",
          introAPR: "Rarely offered",
          creditScoreNeeded: "300+"
        }
      },
      {
        name: "Business Credit Cards",
        description: "Cards designed for business expenses and accounting",
        benefits: [
          "Business-specific rewards categories",
          "Expense tracking tools",
          "Employee cards available",
          "Higher credit limits"
        ],
        drawbacks: [
          "May have high annual fees",
          "Often require personal guarantee",
          "Fewer consumer protections",
          "May require business documentation"
        ],
        bestFor: [
          "Business owners",
          "Freelancers",
          "Those with business expenses",
          "Companies needing employee cards"
        ],
        typicalFeatures: {
          annualFee: "$0-$595",
          rewardsRate: "1-5x on business categories",
          introAPR: "0% for 9-12 months",
          creditScoreNeeded: "670+"
        }
      }
    ]
  },
  rewardPrograms: {
    section: {
      title: "Understanding Credit Card Rewards Programs",
      content: "Credit card rewards programs offer various ways to earn and redeem value from your spending. Understanding how to maximize these programs can lead to significant benefits.",
      keyPoints: [
        "Different types of rewards programs",
        "How to maximize point value",
        "Transfer partners and redemption options",
        "Strategic earning and burning of points"
      ]
    },
    programs: [
      {
        name: "Cash Back",
        description: "Earn a percentage of your purchases back as cash rewards",
        pointValue: "1 cent per point",
        redemptionOptions: [
          {
            option: "Statement Credit",
            value: "1 cent per point",
            details: "Direct reduction of your credit card balance"
          },
          {
            option: "Direct Deposit",
            value: "1 cent per point",
            details: "Cash deposited to your bank account"
          },
          {
            option: "Gift Cards",
            value: "0.8-1 cent per point",
            details: "Convert points to merchant gift cards"
          }
        ]
      },
      {
        name: "Travel Rewards",
        description: "Earn points or miles that can be used for travel expenses",
        pointValue: "1-2 cents per point average",
        redemptionOptions: [
          {
            option: "Direct Travel Booking",
            value: "1-1.5 cents per point",
            details: "Book travel through card issuer portal"
          },
          {
            option: "Point Transfer",
            value: "1.5-2+ cents per point",
            details: "Transfer to airline/hotel partners"
          },
          {
            option: "Statement Credit",
            value: "0.5-1 cent per point",
            details: "Less value than travel redemptions"
          }
        ],
        transferPartners: [
          {
            name: "Major Airlines",
            ratio: "1:1",
            value: "1.5-2+ cents per point"
          },
          {
            name: "Hotel Chains",
            ratio: "1:1-3",
            value: "0.8-1.5 cents per point"
          }
        ]
      },
      {
        name: "Store Rewards",
        description: "Earn enhanced rewards at specific retailers",
        pointValue: "2-5% back at specific stores",
        redemptionOptions: [
          {
            option: "Store Credit",
            value: "Full value",
            details: "Use rewards at the specific retailer"
          },
          {
            option: "Statement Credit",
            value: "Reduced value",
            details: "Convert to general credit card credit"
          }
        ]
      }
    ]
  },
  applicationStrategies: {
    section: {
      title: "Strategic Approaches to Credit Card Applications",
      content: "Successfully applying for credit cards requires understanding timing, credit impacts, and issuer rules. A strategic approach helps maximize approvals and benefits.",
      keyPoints: [
        "Understanding issuer application rules",
        "Timing applications for maximum benefit",
        "Managing credit inquiries",
        "Building a card portfolio"
      ]
    },
    strategies: [
      {
        name: "5/24 Strategy",
        description: "Managing applications around Chase's 5/24 rule and other issuer restrictions",
        steps: [
          "Check current 5/24 status",
          "Prioritize Chase cards first",
          "Space applications by 3-4 months",
          "Consider business cards"
        ],
        benefits: [
          "Maximize approval chances",
          "Access to best sign-up bonuses",
          "Strategic card portfolio building",
          "Minimize credit score impact"
        ],
        considerations: [
          "Issuer-specific rules",
          "Credit score impact",
          "Annual fee timing",
          "Reward program combinations"
        ],
        requiredScore: "720+",
        timeline: "12-24 months"
      },
      {
        name: "Credit Building Path",
        description: "Strategic progression from secured to premium rewards cards",
        steps: [
          "Start with secured card",
          "Graduate to entry-level rewards card",
          "Add complementary category cards",
          "Progress to premium cards"
        ],
        benefits: [
          "Build credit history",
          "Gradual increase in benefits",
          "Learn responsible card use",
          "Minimize rejections"
        ],
        considerations: [
          "Credit score progress",
          "Payment history importance",
          "Utilization management",
          "Annual fee justification"
        ],
        requiredScore: "350+",
        timeline: "24-36 months"
      }
    ]
  },
  commonMistakes: {
    section: {
      title: "Common Credit Card Mistakes and How to Avoid Them",
      content: "Understanding and avoiding common credit card mistakes can save money and protect your credit score.",
      keyPoints: [
        "Identifying risky behaviors",
        "Understanding the cost of mistakes",
        "Prevention strategies",
        "Recovery methods"
      ]
    },
    mistakes: [
      {
        mistake: "Carrying High Balances",
        impact: "High interest charges, lower credit score due to high utilization",
        solution: "Create a payoff plan, consider balance transfer, reduce spending",
        preventionTips: [
          "Set up automatic payments",
          "Track spending carefully",
          "Keep utilization under 30%",
          "Build emergency fund to avoid reliance on credit"
        ]
      },
      {
        mistake: "Missing Payments",
        impact: "Late fees, penalty APR, negative credit report impact",
        solution: "Set up automatic minimum payments, contact issuer if missed",
        preventionTips: [
          "Set up payment reminders",
          "Maintain account calendar",
          "Keep emergency fund for payments",
          "Consider autopay for minimum due"
        ]
      },
      {
        mistake: "Ignoring Card Terms",
        impact: "Unexpected fees, missed benefits, higher costs",
        solution: "Review card terms regularly, set benefit reminders",
        preventionTips: [
          "Read all communications from issuer",
          "Review terms annually",
          "Track promotional periods",
          "Understand fee structures"
        ]
      }
    ]
  },
  securityBestPractices: {
    section: {
      title: "Credit Card Security and Fraud Prevention",
      content: "Protecting your credit cards from fraud and unauthorized use is crucial in today's digital age.",
      keyPoints: [
        "Digital security measures",
        "Physical card protection",
        "Monitoring account activity",
        "Fraud response procedures"
      ]
    },
    tips: [
      {
        category: "online",
        tip: "Use Virtual Card Numbers",
        importance: "high",
        implementation: [
          "Request virtual numbers from issuer",
          "Use unique number for each merchant",
          "Set spending limits per number",
          "Monitor virtual card activity"
        ]
      },
      {
        category: "physical",
        tip: "Secure Physical Cards",
        importance: "high",
        implementation: [
          "Keep cards in secure location",
          "Never leave cards unattended",
          "Consider RFID blocking wallet",
          "Regularly check card presence"
        ]
      },
      {
        category: "monitoring",
        tip: "Set Up Alerts",
        importance: "high",
        implementation: [
          "Enable purchase notifications",
          "Set up fraud alerts",
          "Monitor credit reports",
          "Review statements carefully"
        ]
      },
      {
        category: "travel",
        tip: "Travel Security Measures",
        importance: "medium",
        implementation: [
          "Notify issuers of travel",
          "Carry backup cards",
          "Keep issuer contact info",
          "Use bank ATMs only"
        ],
        additionalNotes: "Consider destination-specific risks"
      }
    ]
  },
  conclusion: {
    title: "Mastering Credit Card Usage",
    content: "Credit cards can be valuable financial tools when used responsibly. Understanding their features, benefits, and potential pitfalls allows you to maximize their value while minimizing risks.",
    keyPoints: [
      "Choose cards that match your needs and habits",
      "Use rewards programs strategically",
      "Maintain strong security practices",
      "Stay informed about card features and terms"
    ]
  }
};
