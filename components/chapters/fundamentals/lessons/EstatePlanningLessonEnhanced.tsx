'use client';

import { useState, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';
import ProgressRing from '@/components/shared/ui/ProgressRing';
import {
  Shield,
  Heart,
  Users,
  Building,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Star,
  Lightbulb,
  DollarSign,
  Award,
  AlertTriangle,
  ScrollText,
  Briefcase,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

interface EstatePlanningLessonProps {
  onComplete?: () => void;
}

interface LessonContent {
  title: string;
  icon: React.ElementType;
  content: {
    concept: string;
    explanation: string;
    realWorldExample: string;
    practicalAction: string;
    warning: string;
  };
}

const enhancedLessons: LessonContent[] = [
  {
    title: "Estate Planning Fundamentals",
    icon: Shield,
    content: {
      concept: "Protecting and Transferring Your Wealth to Future Generations",
      explanation: "Estate planning involves creating a comprehensive strategy to manage your assets during your lifetime and distribute them after death. It includes wills, trusts, beneficiary designations, tax planning, and ensuring your family is protected. Good estate planning minimizes taxes, avoids probate delays, prevents family disputes, and ensures your wishes are carried out. Everyone needs basic estate planning, not just the wealthy.",
      realWorldExample: "When Prince died in 2016 without a will, his $200 million estate faced years of legal battles, massive tax bills (estimated 40%+ to taxes), and family disputes. In contrast, Warren Buffett has pledged 99% of his wealth to charity through carefully structured estate planning, minimizing taxes while maximizing social impact. Even middle-class families benefit - a $500,000 estate can save $50,000+ in taxes and legal fees with proper planning.",
      practicalAction: "Start with the basics: Create a will naming guardians for minor children and distributing assets. Update beneficiaries on all accounts (401k, IRA, life insurance, bank accounts). Consider a revocable living trust if your estate exceeds $100,000 or you own real estate. Meet with an estate planning attorney every 5 years or after major life events (marriage, divorce, children, significant wealth changes).",
      warning: "Without proper estate planning, state laws determine asset distribution (which may not match your wishes), probate can take 6-18 months and cost 3-7% of your estate, and your family may face unnecessary tax burdens. Online will templates are better than nothing but don't address complex tax issues or provide ongoing guidance."
    }
  },
  {
    title: "Wills, Trusts & Legal Documents",
    icon: ScrollText,
    content: {
      concept: "Essential Legal Documents for Comprehensive Estate Protection",
      explanation: "A will distributes assets after death and names guardians for minor children, but must go through probate court. Trusts hold assets during your lifetime and distribute them according to your instructions, often avoiding probate. Key documents include: will, revocable living trust, durable power of attorney (financial decisions), healthcare power of attorney, and advanced healthcare directive. Each serves specific purposes in protecting you and your family.",
      realWorldExample: "A couple with $800,000 in assets and two young children sets up a revocable living trust. When the husband dies unexpectedly, the wife immediately accesses all assets without probate delays or court costs. The trust specifies that if both parents die, assets are managed by a trustee for the children's education and support until age 25, preventing an 18-year-old from inheriting $800,000 all at once.",
      practicalAction: "Create a comprehensive estate plan: Will (backup for assets not in trust), revocable living trust (main asset holder), financial power of attorney (someone to manage money if you're incapacitated), healthcare power of attorney and living will (medical decisions). Fund your trust by transferring real estate, bank accounts, and investment accounts into the trust's name.",
      warning: "Having documents isn't enough - you must 'fund' your trust by actually transferring assets to it. Many people create trusts but never transfer their house or bank accounts, making the trust worthless. Also, powers of attorney become invalid at death - only wills and trusts can distribute assets after death."
    }
  },
  {
    title: "Tax-Efficient Wealth Transfer Strategies",
    icon: Building,
    content: {
      concept: "Minimizing Estate and Gift Taxes While Maximizing Family Wealth",
      explanation: "The federal estate tax exemption is $12.92 million per person (2023), but many states have lower thresholds. Gift tax allows $17,000 per person per year tax-free, plus lifetime exemption usage. Advanced strategies include: charitable remainder trusts (income for life, remainder to charity), generation-skipping trusts (benefit children and grandchildren), life insurance trusts (remove policy value from estate), and family limited partnerships (transfer business interests at discounted valuations).",
      realWorldExample: "A successful business owner worth $20 million creates a grantor retained annuity trust (GRAT), transferring company stock to his children while retaining income payments for 10 years. The business grows 15% annually while he receives 7% payments. After 10 years, $8 million in appreciation passes to his children tax-free, saving approximately $3 million in estate taxes compared to leaving everything in his estate.",
      practicalAction: "Use annual gift tax exclusions strategically: Give $17,000 per year to each child and grandchild (married couples can give $34,000). Consider life insurance in an irrevocable trust to provide liquidity for estate taxes. For larger estates, explore charitable giving strategies that provide income tax deductions while removing assets from your taxable estate. Review and update strategies as tax laws change.",
      warning: "Advanced estate planning strategies can be complex and expensive - ensure the tax savings justify the costs and complications. Many strategies are irrevocable, meaning you can't change your mind later. Tax laws change frequently (the current high exemption expires in 2025), so regular reviews with qualified professionals are essential."
    }
  },
  {
    title: "Life Insurance & Wealth Protection",
    icon: Heart,
    content: {
      concept: "Using Life Insurance as an Estate Planning and Wealth Transfer Tool",
      explanation: "Life insurance serves multiple estate planning purposes: replacing income for surviving family members, providing liquidity to pay estate taxes, equalizing inheritances among children, and transferring wealth tax-efficiently. Term life insurance is cheaper for temporary needs, while permanent life insurance (whole life, universal life) builds cash value and provides lifetime protection. Proper structuring through irrevocable life insurance trusts can remove death benefits from your taxable estate.",
      realWorldExample: "A 45-year-old executive with $5 million net worth has three children, but most wealth is tied up in company stock and real estate. He purchases a $3 million life insurance policy in an irrevocable trust. When he dies, the $3 million death benefit provides immediate liquidity to pay estate taxes and ensures each child receives $1 million in cash, while the illiquid assets can be sold over time at favorable prices rather than forced sales.",
      practicalAction: "Calculate your life insurance needs: 10-12x annual income for young families, decreasing as assets grow and children become independent. Consider term life insurance for temporary needs (mortgage, children's education) and permanent insurance for estate planning. Structure large policies through irrevocable life insurance trusts (ILITs) to remove death benefits from your estate and provide tax-free income to beneficiaries.",
      warning: "Life insurance is not an investment - the cash value growth in permanent policies typically underperforms market investments. Overfunding policies can trigger modified endowment contract (MEC) rules, losing tax advantages. ILIT planning is irrevocable - once you transfer a policy, you generally can't get it back, and the trust must be properly administered with separate tax returns."
    }
  },
  {
    title: "Business Succession & Family Wealth",
    icon: Briefcase,
    content: {
      concept: "Transitioning Business Ownership and Preserving Multi-Generational Wealth",
      explanation: "Business succession planning ensures smooth ownership transfer whether to family members, employees, or external buyers. Key strategies include buy-sell agreements, family limited partnerships, employee stock ownership plans (ESOPs), and installment sales. For family businesses, consider children's interests and capabilities, fair treatment among heirs, and maintaining business operations. Proper planning can provide owner retirement funding while minimizing taxes and family conflicts.",
      realWorldExample: "A $50 million family manufacturing business uses a combination of strategies: The founder gifts 2% equity annually to his two children through a family limited partnership (taking advantage of valuation discounts for minority interests), sells 30% to key employees through an ESOP (providing retirement funds), and retains 30% with buy-sell agreements ensuring smooth transition. This approach spreads risk, rewards employees, and gradually transfers ownership while minimizing estate taxes.",
      practicalAction: "Start succession planning early - ideally 5-10 years before desired transition. Create buy-sell agreements with valuation formulas and funding mechanisms. Consider gifting minority interests to children while retaining voting control. Explore ESOPs if key employees are interested in ownership. Diversify wealth outside the business to reduce family dependence on a single asset. Involve next generation in business operations before ownership transfer.",
      warning: "Many business owners wait too long to plan succession, limiting options and potentially forcing unfavorable sales. Family dynamics can complicate business decisions - not all children may be suited for business ownership. Business valuations can be volatile, affecting tax planning strategies. Professional management may be necessary during transition periods, adding costs and complexity."
    }
  },
  {
    title: "Legacy Planning & Philanthropic Strategies",
    icon: Users,
    content: {
      concept: "Creating Lasting Impact Through Strategic Charitable Giving and Family Values",
      explanation: "Legacy planning goes beyond financial transfers to include values, family governance, and philanthropic goals. Charitable strategies provide tax benefits while supporting causes you care about: donor-advised funds (flexible giving), charitable remainder trusts (income for life, remainder to charity), charitable lead trusts (support charity now, transfer remainder to heirs), and private foundations (ongoing family involvement in philanthropy). These strategies can significantly reduce estate taxes while creating lasting positive impact.",
      realWorldExample: "The Gates family has committed to giving away 99% of their wealth through the Bill & Melinda Gates Foundation, providing massive tax deductions while addressing global health and education issues. On a smaller scale, a $10 million estate might fund a $2 million charitable remainder trust, providing the donor $100,000 annual income for life, a $600,000 tax deduction, and ultimately transferring $8 million to heirs while supporting education causes - saving approximately $800,000 in estate taxes compared to direct inheritance.",
      practicalAction: "Define your family's values and charitable interests. Start with donor-advised funds for flexible giving (minimum $5,000 at most firms). Consider charitable remainder trusts if you have highly appreciated assets and need retirement income. Involve children in philanthropic decisions to instill values and provide purpose beyond wealth accumulation. Document family history and values in letters or videos for future generations.",
      warning: "Charitable strategies are generally irrevocable - once you donate assets, you typically can't get them back even if your financial situation changes. Private foundations require ongoing administration and annual distribution requirements (5% minimum). Family philanthropy can create conflicts if members have different charitable interests. Ensure you maintain adequate assets for your own financial security before committing to large charitable gifts."
    }
  }
];

export default function EstatePlanningLessonEnhanced({ onComplete }: EstatePlanningLessonProps) {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [lessonStartTime, setLessonStartTime] = useState(Date.now());
  const [completedLessons, setCompletedLessons] = useState<boolean[]>(new Array(enhancedLessons.length).fill(false));
  const [showingSummary, setShowingSummary] = useState(false);
  
  const { completeLesson, userProgress } = useProgressStore();

  useEffect(() => {
    setLessonStartTime(Date.now());
  }, [currentLesson]);

  const completedCount = completedLessons.filter(Boolean).length;
  const progressPercentage = (completedCount / enhancedLessons.length) * 100;

  const handleNextLesson = () => {
    if (currentLesson < enhancedLessons.length - 1) {
      setCurrentLesson(prev => prev + 1);
    } else {
      setShowingSummary(true);
    }
  };

  const handlePreviousLesson = () => {
    if (currentLesson > 0) {
      setCurrentLesson(prev => prev - 1);
    }
  };

  const handleCompleteLesson = () => {
    const timeSpent = Math.floor((Date.now() - lessonStartTime) / 1000);
    const lessonId = `estate-planning-enhanced-${currentLesson}`;
    
    completeLesson(lessonId, timeSpent);
    
    setCompletedLessons(prev => {
      const updated = [...prev];
      updated[currentLesson] = true;
      return updated;
    });

    toast.success('Lesson completed! 🎉');
    
    // Auto-advance to next lesson
    setTimeout(() => {
      handleNextLesson();
    }, 1000);
  };

  const handleFinishChapter = () => {
    const totalTimeSpent = Math.floor((Date.now() - lessonStartTime) / 1000);
    completeLesson('estate-planning-chapter-complete', totalTimeSpent);
    toast.success('Chapter 17 completed! Ready for the quiz! 🚀');
    onComplete?.();
  };

  if (showingSummary) {
    return (
      <div className="max-w-4xl mx-auto">
        <GradientCard className="p-8 text-center">
          <div className={`w-20 h-20 ${theme.status.success.bg} rounded-full flex items-center justify-center mx-auto mb-6`}>
            <Award className={`w-10 h-10 ${theme.status.success.text}`} />
          </div>
          
          <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-4`}>
            Estate Planning Mastery Complete! 🎉
          </h2>
          
          <p className={`text-lg ${theme.textColors.secondary} mb-8 max-w-2xl mx-auto`}>
            You've mastered comprehensive estate planning including wills, trusts, tax strategies, 
            life insurance, business succession, and legacy planning. You now understand how to 
            protect your wealth and transfer it efficiently to future generations.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 max-w-3xl mx-auto mb-8">
            {enhancedLessons.map((lesson, index) => (
              <div key={index} className="text-center">
                <div className={`w-12 h-12 ${theme.status.success.bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                  <lesson.icon className={`w-6 h-6 ${theme.status.success.text}`} />
                </div>
                <p className={`text-xs ${theme.textColors.muted}`}>
                  {lesson.title.split(' ')[0]} {lesson.title.split(' ')[1]}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowingSummary(false)}
              className={`px-6 py-3 ${theme.buttons.secondary} rounded-xl transition-all hover-lift flex items-center justify-center`}
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Review Lessons
            </button>
            
            <button
              onClick={handleFinishChapter}
              className={`px-8 py-3 ${theme.buttons.primary} rounded-xl transition-all hover-lift flex items-center justify-center`}
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Take Chapter Quiz
            </button>
          </div>
        </GradientCard>
      </div>
    );
  }

  const currentLessonData = enhancedLessons[currentLesson];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className={`text-4xl font-bold ${theme.textColors.primary} mb-2`}>
          Chapter 17: Estate Planning & Wealth Transfer
        </h1>
        <p className={`text-xl ${theme.textColors.secondary} mb-6`}>
          Protecting and Preserving Your Legacy
        </p>
        
        <div className="flex items-center justify-center gap-8 mb-6">
          <ProgressRing 
            progress={progressPercentage}
            size={80}
            strokeWidth={8}
            className="text-green-400"
          />
          <div className={`text-left ${theme.textColors.secondary}`}>
            <p>Lesson {currentLesson + 1} of {enhancedLessons.length}</p>
            <p className="text-sm">Progress: {completedCount} of {enhancedLessons.length} lessons</p>
            <p className="text-sm">Completion: {Math.round(progressPercentage)}%</p>
          </div>
        </div>
      </div>

      {/* Current Lesson */}
      <GradientCard className="p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-12 h-12 ${theme.backgrounds.glass} rounded-xl flex items-center justify-center border ${theme.borderColors.primary}`}>
            <currentLessonData.icon className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${theme.textColors.primary}`}>
              {currentLessonData.title}
            </h2>
            <p className={`${theme.textColors.muted}`}>
              Lesson {currentLesson + 1} of {enhancedLessons.length}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Core Concept */}
          <div className={`p-6 ${theme.backgrounds.glass} rounded-xl border ${theme.borderColors.primary}`}>
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-6 h-6 text-yellow-400" />
              <h3 className={`text-xl font-bold ${theme.textColors.primary}`}>Core Concept</h3>
            </div>
            <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-3`}>
              {currentLessonData.content.concept}
            </h4>
            <p className={`${theme.textColors.secondary} leading-relaxed`}>
              {currentLessonData.content.explanation}
            </p>
          </div>

          {/* Real Money Example */}
          <div className={`p-6 ${theme.status.success.bg} rounded-xl border border-green-500/20`}>
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="w-6 h-6 text-green-400" />
              <h3 className={`text-xl font-bold ${theme.textColors.primary}`}>Real Money Example</h3>
            </div>
            <p className={`${theme.textColors.secondary} leading-relaxed`}>
              {currentLessonData.content.realWorldExample}
            </p>
          </div>

          {/* Take Action Now */}
          <div className={`p-6 ${theme.status.info.bg} rounded-xl border border-blue-500/20`}>
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-blue-400" />
              <h3 className={`text-xl font-bold ${theme.textColors.primary}`}>Take Action Now</h3>
            </div>
            <p className={`${theme.textColors.secondary} leading-relaxed`}>
              {currentLessonData.content.practicalAction}
            </p>
          </div>

          {/* Warning */}
          <div className={`p-6 ${theme.status.warning.bg} rounded-xl border border-yellow-500/20`}>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
              <h3 className={`text-xl font-bold ${theme.textColors.primary}`}>Important Warning</h3>
            </div>
            <p className={`${theme.textColors.secondary} leading-relaxed`}>
              {currentLessonData.content.warning}
            </p>
          </div>
        </div>

        {/* Lesson Navigation */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-700">
          <button
            onClick={handlePreviousLesson}
            disabled={currentLesson === 0}
            className={`flex items-center px-6 py-3 rounded-xl transition-all ${
              currentLesson === 0 
                ? 'opacity-50 cursor-not-allowed bg-slate-700' 
                : `${theme.buttons.secondary} hover-lift`
            }`}
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </button>

          <div className="flex gap-4">
            {!completedLessons[currentLesson] && (
              <button
                onClick={handleCompleteLesson}
                className={`px-6 py-3 ${theme.buttons.primary} rounded-xl transition-all hover-lift flex items-center`}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Complete Lesson
              </button>
            )}

            <button
              onClick={handleNextLesson}
              className={`flex items-center px-6 py-3 ${theme.buttons.primary} rounded-xl transition-all hover-lift`}
            >
              {currentLesson === enhancedLessons.length - 1 ? (
                <>
                  <Star className="w-5 h-5 mr-2" />
                  Chapter Summary
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </GradientCard>

      {/* Progress Summary */}
      <GradientCard className="p-6">
        <h3 className={`text-lg font-bold ${theme.textColors.primary} mb-4`}>Your Progress</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {enhancedLessons.map((lesson, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border text-center transition-all cursor-pointer ${
                index === currentLesson
                  ? `${theme.status.info.bg} border-blue-500/50`
                  : completedLessons[index]
                  ? `${theme.status.success.bg} border-green-500/50`
                  : `${theme.backgrounds.glass} border-slate-600 opacity-60`
              }`}
              onClick={() => setCurrentLesson(index)}
            >
              <lesson.icon className={`w-6 h-6 mx-auto mb-2 ${
                index === currentLesson
                  ? 'text-blue-400'
                  : completedLessons[index]
                  ? 'text-green-400'
                  : 'text-slate-400'
              }`} />
              <p className={`text-xs ${theme.textColors.muted} leading-tight`}>
                {lesson.title.split(' ').slice(0, 2).join(' ')}
              </p>
              {completedLessons[index] && (
                <CheckCircle className="w-4 h-4 text-green-400 mx-auto mt-1" />
              )}
            </div>
          ))}
        </div>
      </GradientCard>
    </div>
  );
}
