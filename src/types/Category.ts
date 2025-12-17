export type WaveDesign = {
  waveColors: string[]
  waveHeights: number[]
  waveAmplitudes: number[]
}

export type CardItem = {
  title: string
  icon: string
  description: string
  path?: string
  isActive?: boolean
  isFavoritable?: boolean
}

export type Category = {
  title: string
  hoverColor: string
  waveDesign: WaveDesign
  cards: CardItem[]
}
