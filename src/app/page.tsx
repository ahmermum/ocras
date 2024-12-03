'use client'

import TeacherSetup from '@/components/TeacherSetup'

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <TeacherSetup />
      </div>
    </div>
  )
}
