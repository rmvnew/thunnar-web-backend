import { MiniProgress } from "./dto/mini.progress"

export function OperationProgress(currentValue: number, totalValue: number): MiniProgress {
    const res = ((currentValue / totalValue) * 100)

    const mini: MiniProgress = {
        total: totalValue,
        current: currentValue,
        progress: Number(res.toFixed(1))
    }

    return mini

}

