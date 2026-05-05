import { useState } from 'react'
import { InputField } from './InputField'
import { ResultDisplay } from './ResultDisplay'

export function TotalCarbsCalculator() {
  const [targetCarbs, setTargetCarbs] = useState('')
  const [carbsPer100g, setCarbsPer100g] = useState('')

  const targetNum = parseFloat(targetCarbs)
  const carbsNum = parseFloat(carbsPer100g)

  const result =
    targetCarbs && carbsPer100g && carbsNum > 0
      ? (targetNum / carbsNum) * 100
      : null

  return (
    <div className="p-5">
      <p className="text-muted text-sm mb-6">Enter your total carb target in grams</p>
      <InputField
        label="Target carbs"
        value={targetCarbs}
        onChange={setTargetCarbs}
        unit="g"
      />
      <InputField
        label="Carbs per 100g"
        value={carbsPer100g}
        onChange={setCarbsPer100g}
        unit="g / 100g"
      />
      <ResultDisplay value={result} />
    </div>
  )
}
