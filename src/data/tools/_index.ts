import type { Category } from '@/types/Category'
// import { welcomeCategory } from './welcome'
import { calculatorsCategory } from './calculators'
import { cryptographyCategory } from './cryptography'
import { imageCategory } from './imageTools'
import { textToolsCategory } from './textTools'
import { otherToolsCategory } from './otherTools'
import { developerToolsCategory } from './developerTools'

export function getCategories(): Category[] {
  return [
    // welcomeCategory,
    calculatorsCategory,
    cryptographyCategory,
    imageCategory,
    textToolsCategory,
    developerToolsCategory,
    otherToolsCategory,
  ]
}

export {
  // welcomeCategory,
  calculatorsCategory,
  cryptographyCategory,
  imageCategory,
  textToolsCategory,
  otherToolsCategory,
}
