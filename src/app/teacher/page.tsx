import React from 'react';

export default function TeacherPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow container mx-auto py-8">
        {/* ... existing content ... */}
      </div>
      
      <footer className="py-4 text-center text-sm text-gray-600 border-t">
        Powered by <a 
          href="https://teepee.ai" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Teepee.ai
        </a>
      </footer>
    </div>
  )
} 