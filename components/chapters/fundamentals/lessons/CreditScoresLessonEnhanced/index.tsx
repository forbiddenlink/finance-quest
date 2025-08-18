'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Shield, FileText, TrendingUp } from 'lucide-react';
import { content } from './content';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export default function CreditScoresLessonEnhanced() {
  return (
    <div className="space-y-8">
      {/* Introduction */}
      <section className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">{content.introduction.title}</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {content.introduction.description}
          </p>
          <ul className="mt-4 space-y-2">
            {content.introduction.keyPoints.map((point, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-blue-500">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* Credit Score Factors */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Credit Score Factors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {content.creditScoreFactors.map((factor, index) => (
            <motion.div
              key={factor.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    <span>{factor.name}</span>
                    <span className="text-sm text-gray-500">({factor.weight}%)</span>
                  </CardTitle>
                  <CardDescription>{factor.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Best Practices</h4>
                      <ul className="mt-2 space-y-1">
                        {factor.bestPractices.map((practice, i) => (
                          <li key={i} className="text-sm text-gray-600 dark:text-gray-300">
                            • {practice}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium">Common Mistakes</h4>
                      <ul className="mt-2 space-y-1">
                        {factor.commonMistakes.map((mistake, i) => (
                          <li key={i} className="text-sm text-gray-600 dark:text-gray-300">
                            • {mistake}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium">Time to Impact</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{factor.timeToImpact}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Recovery Time</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{factor.recoveryTime}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Credit Bureaus */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Credit Bureaus</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.creditBureaus.map((bureau, index) => (
            <motion.div
              key={bureau.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{bureau.name}</CardTitle>
                  <CardDescription>
                    <a href={bureau.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      {bureau.website}
                    </a>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Report Frequency</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{bureau.reportFrequency}</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Unique Features</h4>
                      <ul className="mt-2 space-y-1">
                        {bureau.uniqueFeatures.map((feature, i) => (
                          <li key={i} className="text-sm text-gray-600 dark:text-gray-300">
                            • {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium">Scoring Model</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{bureau.scoringModel}</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Score Range</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {bureau.scoreRange.min} - {bureau.scoreRange.max}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Dispute Process */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Credit Dispute Process</h2>
        <div className="space-y-6">
          {content.disputeProcess.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <span>Step {step.step}: {step.name}</span>
                  </CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Timeframe</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{step.timeframe}</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Requirements</h4>
                      <ul className="mt-2 space-y-1">
                        {step.requirements.map((req, i) => (
                          <li key={i} className="text-sm text-gray-600 dark:text-gray-300">
                            • {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium">Tips</h4>
                      <ul className="mt-2 space-y-1">
                        {step.tips.map((tip, i) => (
                          <li key={i} className="text-sm text-gray-600 dark:text-gray-300">
                            • {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Credit Milestones */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Credit Score Milestones</h2>
        <div className="space-y-6">
          {content.creditMilestones.map((milestone, index) => (
            <motion.div
              key={milestone.score}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <LineChart className="w-5 h-5 text-blue-500" />
                    <span>Score {milestone.score}+</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Benefits</h4>
                      <ul className="mt-2 space-y-1">
                        {milestone.benefits.map((benefit, i) => (
                          <li key={i} className="text-sm text-gray-600 dark:text-gray-300">
                            • {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium">Requirements</h4>
                      <ul className="mt-2 space-y-1">
                        {milestone.requirements.map((req, i) => (
                          <li key={i} className="text-sm text-gray-600 dark:text-gray-300">
                            • {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium">Next Steps</h4>
                      <ul className="mt-2 space-y-1">
                        {milestone.nextSteps.map((step, i) => (
                          <li key={i} className="text-sm text-gray-600 dark:text-gray-300">
                            • {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Protection Tips */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Credit Protection Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {content.protectionTips.map((tip, index) => (
            <motion.div
              key={tip.category}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-blue-500" />
                    <span>{tip.category}</span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      tip.importance === 'high' ? 'bg-red-100 text-red-800' :
                      tip.importance === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {tip.importance}
                    </span>
                  </CardTitle>
                  <CardDescription>{tip.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Implementation Steps</h4>
                      <ul className="mt-2 space-y-1">
                        {tip.implementation.map((step, i) => (
                          <li key={i} className="text-sm text-gray-600 dark:text-gray-300">
                            • {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium">Frequency</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{tip.frequency}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Conclusion */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Key Takeaways</h2>
        <div className="grid grid-cols-1 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium">Summary</h4>
                    <ul className="mt-2 space-y-2">
                      {content.conclusion.summary.map((point, i) => (
                        <li key={i} className="text-gray-600 dark:text-gray-300">
                          • {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium">Action Items</h4>
                    <ul className="mt-2 space-y-2">
                      {content.conclusion.actionItems.map((item, i) => (
                        <li key={i} className="text-gray-600 dark:text-gray-300">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium">Additional Resources</h4>
                    <ul className="mt-2 space-y-2">
                      {content.conclusion.resources.map((resource, i) => (
                        <li key={i}>
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            {resource.name}
                          </a>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {resource.description}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
