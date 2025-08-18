'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, Trash2 } from 'lucide-react';
import { ScoreGoal } from '../types';
import { TIME_FRAMES } from '../constants';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface GoalsSectionProps {
  goals: ScoreGoal[];
  onAddGoal: (goal: ScoreGoal) => void;
  onRemoveGoal: (id: string) => void;
  onUpdateGoal: (id: string, updates: Partial<ScoreGoal>) => void;
}

export default function GoalsSection({
  goals,
  onAddGoal,
  onRemoveGoal,
  onUpdateGoal
}: GoalsSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Credit Score Goals</h3>
        <Button
          onClick={() => {
            onAddGoal({
              id: '',
              targetScore: 700,
              timeFrame: 'medium_term',
              purpose: '',
              requiredActions: [],
              projectedScore: 0,
              confidenceLevel: 0
            });
          }}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Goal</span>
        </Button>
      </div>

      <div className="space-y-4">
        {goals.map((goal, index) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-blue-500" />
                    <span>Target Score: {goal.targetScore}</span>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveGoal(goal.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <CardDescription>
                  {TIME_FRAMES[goal.timeFrame].label} - {TIME_FRAMES[goal.timeFrame].description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Target Score</Label>
                    <Input
                      type="number"
                      value={goal.targetScore}
                      onChange={(e) => onUpdateGoal(goal.id, {
                        targetScore: parseInt(e.target.value)
                      })}
                    />
                  </div>
                  <div>
                    <Label>Time Frame</Label>
                    <Select
                      value={goal.timeFrame}
                      onValueChange={(value: any) => onUpdateGoal(goal.id, {
                        timeFrame: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(TIME_FRAMES).map(([key, frame]) => (
                          <SelectItem key={key} value={key}>
                            {frame.label} ({frame.description})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Purpose</Label>
                    <Input
                      value={goal.purpose}
                      onChange={(e) => onUpdateGoal(goal.id, {
                        purpose: e.target.value
                      })}
                      placeholder="e.g., Mortgage application, Auto loan, etc."
                    />
                  </div>

                  {goal.projectedScore > 0 && (
                    <div className="mt-4 p-4 rounded bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">Projected Score</div>
                          <div className="text-2xl font-bold">{goal.projectedScore}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Confidence</div>
                          <div className={`text-lg font-medium ${
                            goal.confidenceLevel >= 80 ? 'text-green-600' :
                            goal.confidenceLevel >= 60 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {goal.confidenceLevel}%
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
