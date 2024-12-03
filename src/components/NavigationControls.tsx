import { Button } from "@/components/ui/button"

interface NavigationControlsProps {
  onNext: () => void;
  isLastQuestion: boolean;
}

export default function NavigationControls({ onNext, isLastQuestion }: NavigationControlsProps) {
  return (
    <div className="flex justify-end">
      <Button onClick={onNext}>
        {isLastQuestion ? "Finish Assessment" : "Next Question"}
      </Button>
    </div>
  )
}
