import { forwardRef, type SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, id, className = '', ...props }, ref) => {
    const selectId = id ?? `select-${label.replace(/\s+/g, '-').toLowerCase()}`
    return (
      <div>
        <label htmlFor={selectId} className="mb-1 block text-sm font-medium text-slate-700">
          {label}
        </label>
        <select
          ref={ref}
          id={selectId}
          className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${className}`}
          {...props}
        />
      </div>
    )
  },
)
Select.displayName = 'Select'
