import { useState } from 'react'
import { InputField } from './InputField'
import { ResultDisplay } from './ResultDisplay'

export function ServesCalculator() {
  const [serves, setServes] = useState('')
  const [carbsPer100g, setCarbsPer100g] = useState('')

  const servesNum = parseFloat(serves)
  const carbsNum = parseFloat(carbsPer100g)

  const result =
    serves && carbsPer100g && carbsNum > 0
      ? (servesNum * 15 / carbsNum) * 100
      : null

  return (
    <div className="p-5">
      <p className="text-muted text-sm mb-6">1 serve = 15g of carbs</p>
      <InputField
        label="Number of serves"
        value={serves}
        onChange={setServes}
        unit="serves"
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
