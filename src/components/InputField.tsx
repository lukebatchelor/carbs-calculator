interface Props {
  label: string
  value: string
  onChange: (val: string) => void
  unit: string
}

export function InputField({ label, value, onChange, unit }: Props) {
  return (
    <div className="mb-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">{label}</p>
      <div className="flex items-center bg-surface border-2 border-border rounded-2xl px-5 py-4 gap-3 focus-within:border-primary transition-colors">
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          className="flex-1 text-4xl font-bold text-text bg-transparent outline-none min-w-0 placeholder:text-border"
        />
        <span className="text-sm text-muted font-medium shrink-0">{unit}</span>
      </div>
    </div>
  )
}
