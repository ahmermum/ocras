"use client"

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  readOnly: boolean;
}

export default function CodeEditor({ code, onChange, readOnly }: CodeEditorProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="h-[400px] border rounded-md overflow-hidden">
      <MonacoEditor
        height="100%"
        language="python"
        theme="vs-dark"
        value={code}
        onChange={(value: string | undefined) => onChange(value || '')}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          readOnly: readOnly,
        }}
      />
    </div>
  )
}
