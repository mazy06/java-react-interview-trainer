interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  id?: string
}

export function Switch({ checked, onChange, label, id }: SwitchProps) {
  const switchId = id ?? `switch-${label.replace(/\s+/g, '-').toLowerCase()}`
  return (
    <label
      htmlFor={switchId}
      className="flex cursor-pointer items-center justify-between gap-3 py-1"
    >
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <span className="relative inline-flex">
        <input
          id={switchId}
          type="checkbox"
          role="switch"
          aria-checked={checked}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className="h-6 w-11 rounded-full bg-slate-300 transition-colors duration-200 ease-out
            peer-checked:bg-brand-600 peer-focus-visible:outline peer-focus-visible:outline-2
            peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-600 motion-reduce:transition-none"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow
            transition-transform duration-200 ease-out peer-checked:translate-x-5 motion-reduce:transition-none"
        />
      </span>
    </label>
  )
}
