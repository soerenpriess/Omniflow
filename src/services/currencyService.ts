export async function fetchExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
  const from = fromCurrency.toLowerCase()
  const to = toCurrency.toLowerCase()
  const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${from}.json`

  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Failed to fetch exchange rates')
  }
  const data = await res.json()

  const rate = data[from]?.[to]
  if (rate === undefined) {
    throw new Error(`Exchange rate not available for ${fromCurrency} to ${toCurrency}`)
  }
  return rate
}
