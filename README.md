# DashMetrics 📊

> Dashboard analitico com graficos interativos consumindo dados de criptomoedas via CoinGecko API.

## Sobre

Painel de visualizacao de dados financeiros com atualizacao periodica inteligente 
(polling a cada 30s), graficos interativos (linha, vela, area), filtro por periodo 
e exportacao para CSV.

## Stack

Next.js • Chart.js • Docker • CoinGecko API • Redis (cache)

## Funcionalidades
- Graficos interativos com zoom e tooltip
- Filtro por periodo (7d, 30d, 90d, 1a)
- Exportacao de dados para CSV
- Cache inteligente com Redis
- Tema dark/light
- Containerizado com Docker

## Metrica
Atualizacao a cada 30s via polling inteligente com cache.

