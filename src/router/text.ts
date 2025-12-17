import type { RouteRecordRaw } from 'vue-router'
import WordCounter from '@/views/Text/WordCounter.vue'
import LoreIpsumGenerator from '@/views/Text/LoreIpsumGenerator.vue'
import TextTools from '@/views/Text/TextTools.vue'
import DublicateLineRemover from '@/views/Text/DublicateLineRemover.vue'
import JsonFormattor from '@/views/Text/JsonFormattor.vue'
import TextDiffTool from '@/views/Text/TextDiffTool.vue'
import MarkdownPreview from '@/views/Text/MarkdownPreview.vue'
import RegexTester from '@/views/Text/RegexTester.vue'
import UrlEncoder from '@/views/Text/UrlEncoder.vue'
import HtmlEntityEncoder from '@/views/Text/HtmlEntityEncoder.vue'
import XmlJsonConverter from '@/views/Text/XmlJsonConverter.vue'
import CsvJsonConverter from '@/views/Text/CsvJsonConverter.vue'
import YamlValidator from '@/views/Text/YamlValidator.vue'
import ReadingTime from '@/views/Text/ReadingTime.vue'

export const textRoutes: RouteRecordRaw[] = [
  {
    path: '/text/wordCounter',
    name: 'WordCounter',
    component: WordCounter,
    meta: { isFavoritable: true },
  },
  {
    path: '/text/loremIpsumGenerator',
    name: 'LoreIpsumGenerator',
    component: LoreIpsumGenerator,
    meta: { isFavoritable: true },
  },
  {
    path: '/text/textTools',
    name: 'TextTools',
    component: TextTools,
    meta: { isFavoritable: true },
  },
  {
    path: '/text/dublicateLineRemover',
    name: 'DublicateLineRemover',
    component: DublicateLineRemover,
    meta: { isFavoritable: true },
  },
  {
    path: '/text/jsonFormatter',
    name: 'JsonFormattor',
    component: JsonFormattor,
    meta: { isFavoritable: true },
  },
  {
    path: '/text/textDiffTool',
    name: 'TextDiffTool',
    component: TextDiffTool,
    meta: { isFavoritable: true },
  },
  {
    path: '/text/markdownPreview',
    name: 'MarkdownPreview',
    component: MarkdownPreview,
    meta: { isFavoritable: true },
  },
  {
    path: '/text/regexTester',
    name: 'RegexTester',
    component: RegexTester,
    meta: { isFavoritable: true },
  },
  {
    path: '/text/urlEncoder',
    name: 'UrlEncoder',
    component: UrlEncoder,
    meta: { isFavoritable: true },
  },
  {
    path: '/text/htmlEntityEncoder',
    name: 'HtmlEntityEncoder',
    component: HtmlEntityEncoder,
    meta: { isFavoritable: true },
  },
  {
    path: '/text/xmlJsonConverter',
    name: 'XmlJsonConverter',
    component: XmlJsonConverter,
    meta: { isFavoritable: true },
  },
  {
    path: '/text/csvJsonConverter',
    name: 'CsvJsonConverter',
    component: CsvJsonConverter,
    meta: { isFavoritable: true },
  },
  {
    path: '/text/yamlValidator',
    name: 'YamlValidator',
    component: YamlValidator,
    meta: { isFavoritable: true },
  },
  {
    path: '/text/readingTime',
    name: 'ReadingTime',
    component: ReadingTime,
    meta: { isFavoritable: true },
  },
]
