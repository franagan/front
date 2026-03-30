'use client'

import { useState, useMemo } from 'react'

export interface FireData {
    currentAge: number
    targetAge: number
    currentSavings: number
    monthlyIncome: number
    monthlyExpenses: number
    expectedReturn: number
}

export function useFireCalculator(initialData: FireData) {
    const [fireData, setFireData] = useState<FireData>(initialData)

    const calculations = useMemo(() => {
        const monthlyDifference = fireData.monthlyIncome - fireData.monthlyExpenses
        const yearsToFire = Math.max(0, fireData.targetAge - fireData.currentAge)
        const requiredAmount = fireData.monthlyExpenses * 12 * 25 // 4% Rule
        
        // Compound interest formula for future value of an annuity
        const r = fireData.expectedReturn / 100
        const n = yearsToFire
        const PMT = monthlyDifference * 12
        
        const compoundGrowth = fireData.currentSavings * Math.pow(1 + r, n)
        const annuityGrowth = r > 0 
            ? PMT * (Math.pow(1 + r, n) - 1) / r 
            : PMT * n
            
        const projectedAmount = compoundGrowth + annuityGrowth
        const fireProgress = Math.min((projectedAmount / requiredAmount) * 100, 100)

        // Generate chart data
        const chartData = []
        for (let year = 0; year <= yearsToFire; year++) {
            const amount = fireData.currentSavings * Math.pow(1 + r, year) +
                (monthlyDifference * 12 * (year > 0 ? (Math.pow(1 + r, year) - 1) / r : 0))
            
            chartData.push({
                name: `Año ${fireData.currentAge + year}`,
                patrimonio: Math.round(amount),
                objetivo: requiredAmount
            })
        }

        return {
            monthlyDifference,
            yearsToFire,
            requiredAmount,
            projectedAmount,
            fireProgress,
            chartData
        }
    }, [fireData])

    const updateField = (field: keyof FireData, value: number) => {
        setFireData(prev => ({ ...prev, [field]: value }))
    }

    return {
        fireData,
        updateField,
        ...calculations
    }
}
