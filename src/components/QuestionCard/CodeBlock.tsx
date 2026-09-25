export function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg bg-slate-900 px-4 py-3 text-sm text-slate-100">
      <code className="font-mono">{code}</code>
    </pre>
  )
}
