'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Gift,
  Plane,
  Building2,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { LESSON_CONTENT } from './content';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function CreditCardsMasteryLessonEnhanced() {
  return (
    <div className="space-y-8">
      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>{LESSON_CONTENT.introduction.title}</CardTitle>
            <CardDescription>Master the world of credit cards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>{LESSON_CONTENT.introduction.content}</p>
              <div>
                <div className="font-medium mb-2">Key Points:</div>
                <ul className="list-disc list-inside space-y-1">
                  {LESSON_CONTENT.introduction.keyPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Credit Card Types */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>{LESSON_CONTENT.creditCardTypes.section.title}</span>
            </CardTitle>
            <CardDescription>
              {LESSON_CONTENT.creditCardTypes.section.content}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="rewards">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="rewards">Rewards</TabsTrigger>
                <TabsTrigger value="low-interest">Low Interest</TabsTrigger>
                <TabsTrigger value="secured">Secured</TabsTrigger>
                <TabsTrigger value="business">Business</TabsTrigger>
              </TabsList>
              {LESSON_CONTENT.creditCardTypes.types.map((type, index) => (
                <TabsContent key={index} value={type.name.toLowerCase().replace(' ', '-')}>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{type.name}</h3>
                      <p>{type.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="font-medium mb-2">Benefits:</div>
                        <ul className="space-y-1">
                          {type.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-center space-x-2">
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <div className="font-medium mb-2">Drawbacks:</div>
                        <ul className="space-y-1">
                          {type.drawbacks.map((drawback, i) => (
                            <li key={i} className="flex items-center space-x-2">
                              <XCircle className="w-4 h-4 text-red-500" />
                              <span>{drawback}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <div className="font-medium mb-2">Best For:</div>
                      <ul className="space-y-1">
                        {type.bestFor.map((user, i) => (
                          <li key={i} className="flex items-center space-x-2">
                            <HelpCircle className="w-4 h-4 text-blue-500" />
                            <span>{user}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="font-medium mb-2">Typical Features:</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600">Annual Fee</div>
                          <div>{type.typicalFeatures.annualFee}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Rewards Rate</div>
                          <div>{type.typicalFeatures.rewardsRate}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Intro APR</div>
                          <div>{type.typicalFeatures.introAPR}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Credit Score Needed</div>
                          <div>{type.typicalFeatures.creditScoreNeeded}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* Reward Programs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Gift className="w-5 h-5" />
              <span>{LESSON_CONTENT.rewardPrograms.section.title}</span>
            </CardTitle>
            <CardDescription>
              {LESSON_CONTENT.rewardPrograms.section.content}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {LESSON_CONTENT.rewardPrograms.programs.map((program, index) => (
                <AccordionItem key={index} value={`program-${index}`}>
                  <AccordionTrigger>
                    <div className="flex items-center space-x-2">
                      <span>{program.name}</span>
                      <Badge>{program.pointValue}</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <p>{program.description}</p>

                      <div>
                        <div className="font-medium mb-2">Redemption Options:</div>
                        <div className="space-y-2">
                          {program.redemptionOptions.map((option, i) => (
                            <div key={i} className="bg-gray-50 p-3 rounded-md">
                              <div className="font-medium">{option.option}</div>
                              <div className="text-sm text-gray-600">Value: {option.value}</div>
                              <div className="text-sm">{option.details}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {program.transferPartners && (
                        <div>
                          <div className="font-medium mb-2">Transfer Partners:</div>
                          <div className="space-y-2">
                            {program.transferPartners.map((partner, i) => (
                              <div key={i} className="bg-gray-50 p-3 rounded-md">
                                <div className="font-medium">{partner.name}</div>
                                <div className="text-sm text-gray-600">
                                  Transfer Ratio: {partner.ratio}
                                </div>
                                <div className="text-sm">
                                  Typical Value: {partner.value}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </motion.div>

      {/* Application Strategies */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="w-5 h-5" />
              <span>{LESSON_CONTENT.applicationStrategies.section.title}</span>
            </CardTitle>
            <CardDescription>
              {LESSON_CONTENT.applicationStrategies.section.content}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {LESSON_CONTENT.applicationStrategies.strategies.map((strategy, index) => (
                <div key={index} className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">{strategy.name}</h3>
                    <p className="text-gray-600">{strategy.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="font-medium mb-2">Steps:</div>
                      <ul className="space-y-1">
                        {strategy.steps.map((step, i) => (
                          <li key={i} className="flex items-center space-x-2">
                            <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">
                              {i + 1}
                            </div>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="font-medium mb-2">Benefits:</div>
                      <ul className="space-y-1">
                        {strategy.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-center space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Required Score</div>
                        <div className="font-medium">{strategy.requiredScore}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Timeline</div>
                        <div className="font-medium">{strategy.timeline}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Common Mistakes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>{LESSON_CONTENT.commonMistakes.section.title}</span>
            </CardTitle>
            <CardDescription>
              {LESSON_CONTENT.commonMistakes.section.content}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {LESSON_CONTENT.commonMistakes.mistakes.map((mistake, index) => (
                <div key={index} className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-red-600">
                      {mistake.mistake}
                    </h3>
                    <p className="text-gray-600">{mistake.impact}</p>
                  </div>

                  <div>
                    <div className="font-medium mb-2">Solution:</div>
                    <p>{mistake.solution}</p>
                  </div>

                  <div>
                    <div className="font-medium mb-2">Prevention Tips:</div>
                    <ul className="space-y-1">
                      {mistake.preventionTips.map((tip, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <Shield className="w-4 h-4 text-blue-500" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security Best Practices */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>{LESSON_CONTENT.securityBestPractices.section.title}</span>
            </CardTitle>
            <CardDescription>
              {LESSON_CONTENT.securityBestPractices.section.content}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {LESSON_CONTENT.securityBestPractices.tips.map((tip, index) => (
                <div key={index} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{tip.tip}</h3>
                    <Badge
                      className={
                        tip.importance === 'high'
                          ? 'bg-red-100 text-red-800'
                          : tip.importance === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }
                    >
                      {tip.importance.toUpperCase()}
                    </Badge>
                  </div>

                  <div>
                    <div className="font-medium mb-2">Implementation:</div>
                    <ul className="space-y-1">
                      {tip.implementation.map((step, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">
                            {i + 1}
                          </div>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {tip.additionalNotes && (
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="font-medium">Additional Notes:</div>
                      <p>{tip.additionalNotes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Conclusion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>{LESSON_CONTENT.conclusion.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>{LESSON_CONTENT.conclusion.content}</p>
              <div>
                <div className="font-medium mb-2">Key Takeaways:</div>
                <ul className="list-disc list-inside space-y-1">
                  {LESSON_CONTENT.conclusion.keyPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
