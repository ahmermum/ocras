"use client"

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import QuestionDisplay from './QuestionDisplay'
import CodeEditor from './CodeEditor'
import FeedbackDisplay from './FeedbackDisplay'
import NavigationControls from './NavigationControls'
import { Question, Feedback } from "@/types/assessment"
import questions from '@/data/questions.json'
import { openAIService } from '@/services/openai'

// Mock function to fetch questions (replace with actual API call)
const fetchQuestions = async (questionIds: string[]) => {
  // Simulating API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  return questions.filter(q => questionIds.includes(q.id.toString())).map(q => ({
    ...q,
    id: q.id.toString(),
    systemPrompt: q.systemPrompt || '',
    markingPoints: (q.markingPoints || []).map(mp => ({
      ...mp,
      marks_awarded: 0  // Changed from marksAwarded to marks_awarded
    }))
  }))
}

export default function StudentAssessment() {
  const searchParams = useSearchParams()
  const teacher = searchParams.get('teacher')
  const questionIds = searchParams.get('questions')?.split(',') || []
  const showFeedback = searchParams.get('feedback') === 'true'

  const [nameInput, setNameInput] = useState("")
  const [studentName, setStudentName] = useState("")
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [code, setCode] = useState("")
  const [feedbackState, setFeedbackState] = useState<Feedback | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Add a ref to track if initial code has been set
  const initialCodeSet = useRef(false)

  // Modified effect for initial load
  useEffect(() => {
    if (questionIds.length > 0 && !initialCodeSet.current) {
      fetchQuestions(questionIds)
        .then(fetchedQuestions => {
          setQuestions(fetchedQuestions)
          if (fetchedQuestions[0]?.initialCode) {
            setCode(fetchedQuestions[0].initialCode)
            initialCodeSet.current = true
          }
        })
    }
  }, [questionIds])

  // Separate effect for handling question changes
  useEffect(() => {
    if (!initialCodeSet.current) return; // Skip if initial code hasn't been set
    
    const currentQuestion = questions[currentQuestionIndex]
    if (currentQuestion) {
      setCode(currentQuestion.initialCode || '')
      setIsSubmitted(false)
      setFeedbackState(null)
    }
  }, [currentQuestionIndex]) // Remove questions from dependency array

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      const currentQuestion = questions[currentQuestionIndex]

      // Check if the code has been modified from the initial code
      if (!code.trim() || code.trim() === currentQuestion.initialCode.trim()) {
        alert('Please modify the code before submitting.')
        return
      }

      const evaluationResponse = await openAIService.evaluateCode(
        currentQuestion,
        code
      )

      const evaluation = typeof evaluationResponse === 'string' 
        ? JSON.parse(evaluationResponse) 
        : evaluationResponse;

      // Map the marking points to use the correct IDs from the question
      const mappedMarkingPoints = currentQuestion.markingPoints.map((mp, index) => {
        // Find corresponding evaluation point
        const evalPoint = evaluation.marking_points[index];
        
        return {
          id: mp.id, // Use the ID from the question's marking points (1.1, 1.2, etc.)
          description: mp.description, // Use the description from the question
          marks: mp.marks,
          required: mp.required || false,
          marks_awarded: evalPoint?.marks_awarded || 0,
          feedback: evalPoint?.feedback || '',
          evidence: evalPoint?.evidence || ''
        };
      });

      setFeedbackState({
        marks: evaluation.final_mark,
        feedback: evaluation.explanation_to_student,
        markingCriteria: [
          { 
            criterion: "AI Assessment", 
            availableMarks: currentQuestion.marks, 
            assignedMarks: evaluation.final_mark 
          }
        ],
        marking_points: mappedMarkingPoints
      });
      
      setIsSubmitted(true)
    } catch (error) {
      console.error('Error submitting code:', error)
      alert('Failed to submit code for evaluation. Please check your answer and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Modified handleNext
  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      await sendResultsToTeacher()
      alert("Assessment completed! Results have been sent to the teacher.")
    }
  }

  const handleStartAssessment = () => {
    const trimmedName = nameInput.trim()
    if (trimmedName.length === 0) {
      alert("Please enter your name")
      return
    }
    setStudentName(trimmedName)
  }

  // Move sendResultsToTeacher here
  const sendResultsToTeacher = async () => {
    try {
      const results = {
        teacherEmail: teacher,
        studentName: studentName,
        questions: questions.map((q, index) => ({
          questionNumber: index + 1,
          questionText: q.text,
          studentCode: code,
          marks: q.markingPoints.reduce((total, mp) => total + (mp.marks_awarded ?? 0), 0),
          totalPossibleMarks: q.marks,
          feedback: feedbackState?.feedback || ''
        })),
        totalMarks: questions.reduce((total, q) => 
          total + q.markingPoints.reduce((sum, mp) => sum + (mp.marks_awarded ?? 0), 0), 0),
        totalPossibleMarks: questions.reduce((total, q) => total + q.marks, 0)
      }

      const response = await fetch('/api/send-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(results)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send results')
      }
    } catch (error) {
      console.error('Error sending results:', error)
      throw error // Re-throw to be handled by the caller
    }
  }

  if (questions.length === 0) {
    return <div>Loading...</div>
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>OCR Programming Assessment</CardTitle>
        <CardDescription>Complete the coding questions below</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!studentName ? (
          <div>
            <label htmlFor="student-name" className="block text-sm font-medium text-gray-700">Your Name</label>
            <Input
              type="text"
              id="student-name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Enter your name"
              required
            />
            <Button 
              onClick={handleStartAssessment}
              className="mt-2"
            >
              Start Assessment
            </Button>
          </div>
        ) : (
          <>
            <QuestionDisplay 
              question={currentQuestion} 
              currentIndex={currentQuestionIndex}
              totalQuestions={questions.length}
            />
            <CodeEditor 
              code={code} 
              onChange={setCode} 
              readOnly={isSubmitted}  // This controls editability
            />
            {!isSubmitted ? (
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Evaluating...' : 'Submit Answer'}
              </Button>
            ) : (
              <>
                <FeedbackDisplay feedback={feedbackState} showDetailed={showFeedback} />
                <NavigationControls onNext={handleNext} isLastQuestion={currentQuestionIndex === questions.length - 1} />
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

