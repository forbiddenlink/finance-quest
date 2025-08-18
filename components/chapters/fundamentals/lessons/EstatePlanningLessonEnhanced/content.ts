import {
  Scroll,
  Shield,
  Calculator,
  Building,
  Heart,
  Users
} from 'lucide-react';
import { LessonContent } from './types';

export const enhancedLessons: LessonContent[] = [
  {
    title: "Estate Planning Fundamentals",
    content: `Estate planning is more than just writing a will - it's a comprehensive strategy to protect and transfer your wealth efficiently. Understanding the basics helps you make informed decisions about your legacy.`,
    keyPoints: [
      "Estate planning protects your assets and ensures they're distributed according to your wishes",
      "A well-structured plan can minimize taxes and avoid probate delays",
      "Regular updates are crucial as your life circumstances change"
    ],
    practicalAction: "Create an inventory of all your assets, including digital assets and personal property.",
    moneyExample: "A $2M estate without proper planning could lose $800K to taxes and fees. With planning, the tax burden could be reduced to $200K.",
    warningTip: "Don't wait until retirement to start estate planning - unexpected events can happen at any age.",
    icon: Scroll
  },
  {
    title: "Wills and Trust Structures",
    content: `Understanding different trust types and their benefits is crucial for effective estate planning. Each structure serves specific purposes and offers unique advantages.`,
    keyPoints: [
      "Revocable trusts offer flexibility but limited tax benefits",
      "Irrevocable trusts provide tax advantages and asset protection",
      "Special trusts can be used for specific purposes like charity or education"
    ],
    practicalAction: "Compare revocable and irrevocable trusts to determine which best suits your needs.",
    moneyExample: "A $1M life insurance policy in an ILIT (Irrevocable Life Insurance Trust) can save beneficiaries $400K in estate taxes.",
    warningTip: "Don't assume a will alone is sufficient - trusts offer additional benefits and protection.",
    icon: Shield
  },
  {
    title: "Tax Planning Strategies",
    content: `Strategic tax planning can significantly reduce estate taxes and maximize wealth transfer to your beneficiaries. Understanding current tax laws and exemptions is essential.`,
    keyPoints: [
      "Federal estate tax exemption changes periodically",
      "State estate taxes vary by location",
      "Gift tax strategies can reduce taxable estate value"
    ],
    practicalAction: "Calculate your potential estate tax liability and identify opportunities for tax reduction.",
    moneyExample: "Annual gifts of $17,000 to each of 4 children over 10 years can transfer $680,000 tax-free.",
    warningTip: "Don't overlook state estate taxes - some states have much lower exemptions than federal.",
    icon: Calculator
  },
  {
    title: "Business Succession Planning",
    content: `For business owners, succession planning is crucial for ensuring business continuity and preserving value across generations. It requires careful consideration of leadership, ownership, and tax implications.`,
    keyPoints: [
      "Only 30% of family businesses survive to the second generation",
      "Early planning increases success rates significantly",
      "Consider both management and ownership succession"
    ],
    practicalAction: "Create a detailed business succession plan including timeline and training requirements.",
    moneyExample: "A $5M family business structured properly can save $2M in estate taxes through valuation discounts and transfers.",
    warningTip: "Don't assume family members want to or can run the business - have contingency plans.",
    icon: Building
  },
  {
    title: "Healthcare Directives and Power of Attorney",
    content: `Medical and financial decisions need clear documentation to ensure your wishes are followed if you become incapacitated. These documents are essential parts of a complete estate plan.`,
    keyPoints: [
      "Living wills specify medical treatment preferences",
      "Healthcare proxy designates medical decision-maker",
      "Durable power of attorney covers financial decisions"
    ],
    practicalAction: "Create or update your healthcare directive and power of attorney documents.",
    moneyExample: "Lack of proper documentation can cost families $10,000+ in legal fees to gain decision-making authority.",
    warningTip: "Don't wait for a health crisis - these documents must be created while you're of sound mind.",
    icon: Heart
  },
  {
    title: "Beneficiary Planning and Asset Protection",
    content: `Careful beneficiary planning ensures assets transfer smoothly and provides protection for vulnerable beneficiaries. Consider special circumstances and potential future changes.`,
    keyPoints: [
      "Beneficiary designations override will provisions",
      "Special needs trusts protect government benefits",
      "Spendthrift provisions protect against creditors"
    ],
    practicalAction: "Review and update all beneficiary designations on accounts and policies.",
    moneyExample: "A $500K inheritance in a properly structured trust can provide lifetime support while protecting from creditors.",
    warningTip: "Don't forget to update beneficiaries after major life events like marriage or divorce.",
    icon: Users
  }
];
