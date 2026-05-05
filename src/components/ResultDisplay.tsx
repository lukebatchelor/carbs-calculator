interface Props {
  value: number | null
}

export function ResultDisplay({ value }: Props) {
  const valid = value !== null && isFinite(value) && value > 0

  return (
    <div className="mt-6 rounded-3xl bg-primary-subtle p-8 text-center min-h-36 flex flex-col items-center justify-center">
      {valid ? (
        <>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Use</p>
          <p className="text-6xl font-bold text-result leading-none">{(value as number).toFixed(1)}</p>
          <p className="text-lg text-muted mt-2">grams</p>
        </>
      ) : (
        <p className="text-muted text-sm">Enter values above to see the result</p>
      )}
    </div>
  )
}
