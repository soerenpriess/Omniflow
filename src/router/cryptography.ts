import type { RouteRecordRaw } from 'vue-router'
import BcryptGenerator from '@/views/Cryptography/BcryptGenerator.vue'
import AES from '@/views/Cryptography/AES.vue'
import Base64 from '@/views/Cryptography/Base64.vue'
import PasswordGenerator from '@/views/Cryptography/PasswordGenerator.vue'
import ShaGenerator from '@/views/Cryptography/ShaGenerator.vue'
import Md5Generator from '@/views/Cryptography/Md5Generator.vue'
import UuidGenerator from '@/views/Cryptography/UuidGenerator.vue'
import JwtDecoder from '@/views/Cryptography/JwtDecoder.vue'
import ReverseShellGenerator from '@/views/Cryptography/ReverseShellGenerator.vue'
import HashIdentifier from '@/views/Cryptography/HashIdentifier.vue'
import SqlInjectionGenerator from '@/views/Cryptography/SqlInjectionGenerator.vue'
import XssPayloadGenerator from '@/views/Cryptography/XssPayloadGenerator.vue'

export const cryptographyRoutes: RouteRecordRaw[] = [
  {
    path: '/cryptography/bcryptGenerator',
    name: 'BcryptGenerator',
    component: BcryptGenerator,
    meta: { isFavoritable: true },
  },
  {
    path: '/cryptography/aes',
    name: 'AES',
    component: AES,
    meta: { isFavoritable: true },
  },
  {
    path: '/cryptography/base64',
    name: 'Base64',
    component: Base64,
    meta: { isFavoritable: true },
  },
  {
    path: '/cryptography/passwordGenerator',
    name: 'PasswordGenerator',
    component: PasswordGenerator,
    meta: { isFavoritable: true },
  },
  {
    path: '/cryptography/shaGenerator',
    name: 'ShaGenerator',
    component: ShaGenerator,
    meta: { isFavoritable: true },
  },
  {
    path: '/cryptography/md5Generator',
    name: 'Md5Generator',
    component: Md5Generator,
    meta: { isFavoritable: true },
  },
  {
    path: '/cryptography/uuidGenerator',
    name: 'UuidGenerator',
    component: UuidGenerator,
    meta: { isFavoritable: true },
  },
  {
    path: '/cryptography/jwtDecoder',
    name: 'JwtDecoder',
    component: JwtDecoder,
    meta: { isFavoritable: true },
  },
  {
    path: '/cryptography/reverseShellGenerator',
    name: 'ReverseShellGenerator',
    component: ReverseShellGenerator,
    meta: { isFavoritable: true },
  },
  {
    path: '/cryptography/hashIdentifier',
    name: 'HashIdentifier',
    component: HashIdentifier,
    meta: { isFavoritable: true },
  },
  {
    path: '/cryptography/sqlInjectionGenerator',
    name: 'SqlInjectionGenerator',
    component: SqlInjectionGenerator,
    meta: { isFavoritable: true },
  },
  {
    path: '/cryptography/xssPayloadGenerator',
    name: 'XssPayloadGenerator',
    component: XssPayloadGenerator,
    meta: { isFavoritable: true },
  },
]
