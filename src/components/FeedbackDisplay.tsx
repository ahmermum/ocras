import { Feedback } from "@/types/assessment"
import { cn } from "@/lib/utils"

interface FeedbackDisplayProps {
  feedback: Feedback | null;
  showDetailed: boolean;
}

export default function FeedbackDisplay({ feedback, showDetailed }: FeedbackDisplayProps) {
  if (!feedback) return null;

  return (
    <div className="space-y-4">
      <div className="text-xl font-bold">
        Score: {feedback.marks}
      </div>
      
      <div className="text-gray-700 whitespace-pre-line mb-4">
        {feedback.feedback.replace(/\\n/g, '\n').replace(/\n/g, '\n')}
      </div>

      {showDetailed && feedback.marking_points && feedback.marking_points.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="font-semibold text-lg mb-3">Mark Breakdown:</h3>
          {feedback.marking_points.map((point) => (
            <div 
              key={point.id} 
              className={cn(
                "pl-4 border-l-4 py-3 rounded transition-colors",
                (point.marks_awarded ?? 0) > 0 
                  ? "border-green-500 bg-green-50/80" 
                  : "border-red-500 bg-red-50/80"
              )}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-grow">
                  <p className={cn(
                    "text-sm font-medium mb-1",
                    (point.marks_awarded ?? 0) > 0 ? "text-green-700" : "text-red-700"
                  )}>
                    [{point.id}] {point.description}
                  </p>
                  <p className="text-sm text-gray-600 italic">{point.feedback}</p>
                </div>
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <span className={cn(
                    "text-sm font-medium",
                    (point.marks_awarded ?? 0) > 0 ? "text-green-700" : "text-red-700"
                  )}>
                    {point.marks_awarded}/{point.marks} marks
                  </span>
                </div>
              </div>
              {point.feedback && (
                <p className="text-xs text-gray-500 mt-1">Evidence: {point.feedback}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
