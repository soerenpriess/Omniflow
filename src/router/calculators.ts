import type { RouteRecordRaw } from 'vue-router'
import BasicCalculator from '@/views/Calculators/BasicCalculator.vue'
import UnitConverter from '@/views/Calculators/UnitConverter.vue'
import CurrencyConverter from '@/views/Calculators/CurrencyConverter.vue'
import CryptoConverter from '@/views/Calculators/CryptoConverter.vue'
import PercentCalculator from '@/views/Calculators/PercentCalculator.vue'
import BmiCalculator from '@/views/Calculators/BmiCalculator.vue'
import DateCalculator from '@/views/Calculators/DateCalculator.vue'
import LoanMortgageCalculator from '@/views/Calculators/LoanMortgageCalculator.vue'
import TipCalculator from '@/views/Calculators/TipCalculator.vue'
import TimeZoneConverter from '@/views/Calculators/TimeZoneConverter.vue'
import CalorieCalculator from '@/views/Calculators/CalorieCalculator.vue'
import UnixTimestampConverter from '@/views/Calculators/UnixTimestampConverter.vue'
import RomanNumeralConverter from '@/views/Calculators/RomanNumeralConverter.vue'
import BinaryHexConverter from '@/views/Calculators/BinaryHexConverter.vue'
import CidrCalculator from '@/views/Calculators/CidrCalculator.vue'

export const calculatorRoutes: RouteRecordRaw[] = [
  {
    path: '/calculator/basicCalculator',
    name: 'BasicCalculator',
    component: BasicCalculator,
    meta: { isFavoritable: true },
  },
  {
    path: '/calculator/unitConverter',
    name: 'UnitConverter',
    component: UnitConverter,
    meta: { isFavoritable: true },
  },
  {
    path: '/calculator/currencyConverter',
    name: 'CurrencyConverter',
    component: CurrencyConverter,
    meta: { isFavoritable: true },
  },
  {
    path: '/calculator/cryptoConverter',
    name: 'CryptoConverter',
    component: CryptoConverter,
    meta: { isFavoritable: true },
  },
  {
    path: '/calculator/percentCalculator',
    name: 'PercentCalculator',
    component: PercentCalculator,
    meta: { isFavoritable: true },
  },
  {
    path: '/calculator/bmiCalculator',
    name: 'BmiCalculator',
    component: BmiCalculator,
    meta: { isFavoritable: true },
  },
  {
    path: '/calculator/dateCalculator',
    name: 'DateCalculator',
    component: DateCalculator,
    meta: { isFavoritable: true },
  },
  {
    path: '/calculator/loanCalculator',
    name: 'LoanMortgageCalculator',
    component: LoanMortgageCalculator,
    meta: { isFavoritable: true },
  },
  {
    path: '/calculator/tipCalculator',
    name: 'TipCalculator',
    component: TipCalculator,
    meta: { isFavoritable: true },
  },
  {
    path: '/calculator/timeZoneConverter',
    name: 'TimeZoneConverter',
    component: TimeZoneConverter,
    meta: { isFavoritable: true },
  },
  {
    path: '/calculator/calorieCalculator',
    name: 'CalorieCalculator',
    component: CalorieCalculator,
    meta: { isFavoritable: true },
  },
  {
    path: '/calculator/unixTimestampConverter',
    name: 'UnixTimestampConverter',
    component: UnixTimestampConverter,
    meta: { isFavoritable: true },
  },
  {
    path: '/calculator/romanNumeralConverter',
    name: 'RomanNumeralConverter',
    component: RomanNumeralConverter,
    meta: { isFavoritable: true },
  },
  {
    path: '/calculator/binaryHexConverter',
    name: 'BinaryHexConverter',
    component: BinaryHexConverter,
    meta: { isFavoritable: true },
  },
  {
    path: '/calculator/cidrCalculator',
    name: 'CidrCalculator',
    component: CidrCalculator,
    meta: { isFavoritable: true },
  },
]
