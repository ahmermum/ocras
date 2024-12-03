"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { XCircle } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"
import questions from '@/data/questions.json'
import { Question } from "@/types/assessment"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function TeacherSetup() {
  const [email, setEmail] = useState("")
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([])
  const [showFeedback, setShowFeedback] = useState(true)
  const [generatedLink, setGeneratedLink] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [showLinkDialog, setShowLinkDialog] = useState(false)

  // Add effect to handle error display
  useEffect(() => {
    if (error) {
      // Scroll to top of the page with some offset
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }, [error])

  // Group questions by difficulty
  const groupedQuestions = questions.reduce((acc, question) => {
    const difficulty = question.difficulty.toLowerCase()
    if (!acc[difficulty]) {
      acc[difficulty] = []
    }
    acc[difficulty].push(question)
    return acc
  }, {} as Record<string, typeof questions>)

  const handleQuestionToggle = (questionId: string) => {
    setSelectedQuestions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    )
  }

  const generateLink = () => {
    // Clear any existing error
    setError(null)

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    // Check email format first
    if (!email.trim() || !emailRegex.test(email)) {
      setError("Please enter a valid email address.")
      return
    }

    // Then check questions
    if (selectedQuestions.length === 0) {
      setError("Please select at least one question for the assessment.")
      return
    }

    // If both validations pass, generate the link
    const baseUrl = window.location.origin
    const link = `${baseUrl}/assessment?teacher=${encodeURIComponent(email)}&questions=${selectedQuestions.join(',')}&feedback=${showFeedback}`
    setGeneratedLink(link)
    setShowLinkDialog(true)
  }

  const handleSaveAndClose = () => {
    // Copy to clipboard
    navigator.clipboard.writeText(generatedLink)
      .then(() => {
        // Close the dialog
        setShowLinkDialog(false)
      })
      .catch((err) => {
        console.error('Failed to copy link:', err)
        // Still close the dialog even if copy fails
        setShowLinkDialog(false)
      })
  }

  const QuestionGroup = ({ title, questions, colorClass }: { 
    title: string, 
    questions: Question[],
    colorClass: string 
  }) => (
    <div className="mb-6">
      <h3 className={`text-lg font-medium ${colorClass} mb-2`}>{title}</h3>
      <div className="pl-4 border-l-2 space-y-2">
        {questions.map((question) => (
          <div key={question.id}>
            <div className="flex items-start gap-3">
              <Checkbox
                id={`question-${question.id}`}
                checked={selectedQuestions.includes(question.id.toString())}
                onCheckedChange={() => handleQuestionToggle(question.id.toString())}
                className="mt-1"
              />
              <label 
                htmlFor={`question-${question.id}`} 
                className="text-sm hover:text-gray-600 cursor-pointer flex-1"
              >
                <span className="font-medium"><strong>Question</strong>:</span> {question.text}
                {' '}
                <span className="text-gray-500">(<strong>{question.marks} marks</strong>)</span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>OCR P2 Practice & Assessment Tool</CardTitle>
        <div className="flex items-center gap-2">
          <CardDescription>Set up your assessment</CardDescription>
          <Dialog>
            <DialogTrigger className="text-sm text-blue-500 hover:text-blue-600 hover:underline">
              How does this work?
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>How to use the Assessment Tool</DialogTitle>
                <DialogDescription className="space-y-4 pt-4">
                  <div>
                    <h4 className="font-semibold mb-2">For Teachers:</h4>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>Enter your email address where you'll receive results</li>
                      <li>Select the programming questions you want to include</li>
                      <li>Choose whether to show detailed feedback to students</li>
                      <li>Generate and share the assessment link with your students</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">For Students:</h4>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>Click the assessment link provided by their teacher</li>
                      <li>Enter their name to begin the assessment</li>
                      <li>Write code solutions for each question</li>
                      <li>Submit their answers for automatic marking</li>
                      <li>View their results and feedback immediately</li>
                    </ol>
                    <p className="mt-2 text-sm text-gray-500">
                      <strong>Note:</strong> Once all questions are completed, results are automatically emailed to the teacher.
                    </p>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert 
            variant="destructive" 
            className="mb-4 sticky top-4 z-50 shadow-lg"
          >
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Your Email
            </label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-[200px] text-sm">
                    We'll email you each student's results when they complete the assessment
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Select Questions</h3>
          {groupedQuestions.easy && (
            <QuestionGroup 
              title="Easy Questions" 
              questions={groupedQuestions.easy}
              colorClass="text-green-600"
            />
          )}
          {groupedQuestions.moderate && (
            <QuestionGroup 
              title="Moderate Questions" 
              questions={groupedQuestions.moderate}
              colorClass="text-yellow-600"
            />
          )}
          {groupedQuestions.hard && (
            <QuestionGroup 
              title="Hard Questions" 
              questions={groupedQuestions.hard}
              colorClass="text-red-600"
            />
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-feedback"
              checked={showFeedback}
              onCheckedChange={() => setShowFeedback(!showFeedback)}
            />
            <div className="flex items-center gap-2">
              <label htmlFor="show-feedback" className="text-sm">
                Show detailed feedback to students
              </label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[200px] text-sm">
                      When enabled, students will see a detailed breakdown of their marks and specific feedback for each marking point
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <p className="text-sm text-gray-500 ml-6">
            Students will always see their total score. This option shows additional detailed feedback.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-4">
        <Button onClick={generateLink}>Generate Assessment Link</Button>
      </CardFooter>

      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assessment Link Generated</DialogTitle>
            <DialogDescription>
              Share this link with your students to start the assessment:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="text"
              value={generatedLink}
              readOnly
              className="mt-2"
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleSaveAndClose}
              >
                Copy and Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

