import React, { useState, useEffect } from "react"
import "./styles.css"

interface DataPoint { name: string; value: number; date: string }

const cryptoData: Record<string, { color: string; data: DataPoint[] }> = {
  BTC: { color: "#f7931a", data: [] },
  ETH: { color: "#627eea", data: [] },
  SOL: { color: "#00ffbd", data: [] },
}

function generateMockData(base: number, count: number): DataPoint[] {
  const data: DataPoint[] = []
  let val = base
  for (let i = 30; i >= 0; i--) {
    val *= (1 + (Math.random() - 0.5) * 0.06)
    const d = new Date(); d.setDate(d.getDate() - i)
    data.push({ name: d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }), value: val, date: d.toISOString().slice(0,10) })
  }
  return data
}

Object.keys(cryptoData).forEach(k => { cryptoData[k].data = generateMockData(k === "BTC" ? 85000 : k === "ETH" ? 4200 : 180, 30) })

export default function App() {
  const [selected, setSelected] = useState("BTC")
  const [tooltip, setTooltip] = useState<{ x: number; y: number; data: DataPoint } | null>(null)
  const [timeframe, setTimeframe] = useState(30)

  const coin = cryptoData[selected]
  const data = coin.data.slice(-timeframe)
  const maxVal = Math.max(...data.map(d => d.value))
  const minVal = Math.min(...data.map(d => d.value))
  const range = maxVal - minVal || 1
  const change = ((data[data.length - 1].value - data[0].value) / data[0].value * 100).toFixed(2)
  const isPositive = parseFloat(change) >= 0

  const currentVal = data[data.length - 1].value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const svgWidth = 700; const svgHeight = 300; const padding = { top: 20, right: 20, bottom: 30, left: 60 }
  const chartW = svgWidth - padding.left - padding.right
  const chartH = svgHeight - padding.top - padding.bottom

  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * chartW
    const y = padding.top + chartH - ((d.value - minVal) / range) * chartH
    return { ...d, x, y }
  })

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")
  const areaPath = `${linePath} L ${points[points.length-1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(p => {
    const val = minVal + p * range
    return { y: padding.top + chartH - p * chartH, label: val.toLocaleString("pt-BR", { minimumFractionDigits: 0 }) }
  })

  return React.createElement("div", { className: "app" },
    React.createElement("header", { className: "header" },
      React.createElement("div", { className: "container header-inner" },
        React.createElement("h1", null, "📊 DashMetrics"),
        React.createElement("div", { className: "header-right" },
          React.createElement("span", { className: `change ${isPositive ? "up" : "down"}` },
            `${isPositive ? "+" : ""}${change}%`
          ),
          React.createElement("span", { className: "current-value" }, `$${currentVal}`)
        )
      )
    ),
    React.createElement("main", { className: "container" },
      React.createElement("div", { className: "coins-bar" },
        Object.keys(cryptoData).map(k => React.createElement("button", {
          key: k, className: `coin-btn ${selected === k ? "active" : ""}`,
          onClick: () => setSelected(k)
        },
          React.createElement("span", { className: "coin-indicator", style: { background: cryptoData[k].color } }),
          k
        ))
      ),
      React.createElement("div", { className: "chart-card" },
        React.createElement("div", { className: "timeframes" },
          [7, 14, 30].map(t => React.createElement("button", {
            key: t, className: `tf-btn ${timeframe === t ? "active" : ""}`,
            onClick: () => setTimeframe(t) }, `${t}d`
          ))
        ),
        React.createElement("svg", { viewBox: `0 0 ${svgWidth} ${svgHeight}`, className: "chart-svg", style: { width: "100%", height: "auto" } },
          yTicks.map((t, i) => React.createElement(React.Fragment, { key: i },
            React.createElement("text", { x: padding.left - 8, y: t.y + 4, textAnchor: "end", fill: "#a1a1aa", fontSize: 11 }, t.label),
            React.createElement("line", { x1: padding.left, y1: t.y, x2: svgWidth - padding.right, y2: t.y, stroke: "rgba(255,255,255,.05)", strokeWidth: 1 })
          )),
          React.createElement("path", { d: areaPath, fill: `${coin.color}15`, stroke: "none" }),
          React.createElement("path", { d: linePath, fill: "none", stroke: coin.color, strokeWidth: 2, strokeLinecap: "round" }),
          points.filter((_, i) => i === points.length - 1 || (i % 5 === 0)).map((p, i) =>
            React.createElement("circle", { key: i, cx: p.x, cy: p.y, r: 3, fill: coin.color, stroke: "#fff", strokeWidth: 1 })
          )
        ),
        React.createElement("div", { className: "chart-footer" },
          React.createElement("span", null, `Min: $${minVal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`),
          React.createElement("span", null, `Max: $${maxVal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`)
        )
      )
    )
  )
}
