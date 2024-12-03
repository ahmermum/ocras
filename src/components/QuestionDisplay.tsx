"use client"

import Image from 'next/image'
import { Question } from "@/types/assessment"
import React from 'react'

interface QuestionDisplayProps {
  question: Question
  currentIndex: number
  totalQuestions: number
}

const QuestionDisplay = React.memo(({ question, currentIndex, totalQuestions }: QuestionDisplayProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Question {currentIndex + 1} of {totalQuestions}
        </h2>
        <span className="text-sm text-gray-500">
          {question.marks} marks • {question.difficulty}
        </span>
      </div>
      
      <div className="prose max-w-none">
        <p className="whitespace-pre-line">{question.text}</p>
        
        {/* Display image if it exists */}
        {question.image && (
          <div className="my-4 flex justify-center">
            <Image
              src={question.image.src}
              alt={question.image.alt}
              width={question.image.width}
              height={question.image.height}
              className="rounded-lg shadow-md"
            />
          </div>
        )}
      </div>
    </div>
  )
})

export default QuestionDisplay
