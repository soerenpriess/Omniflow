import type { RouteRecordRaw } from 'vue-router'
import ImageCompressor from '@/views/ImageTools/ImageCompressor.vue'
import ImageCropRotate from '@/views/ImageTools/ImageCropRotate.vue'
import GifFrameExtractor from '@/views/ImageTools/GifFrameExtractor.vue'
import BackgroundRemover from '@/views/ImageTools/BackgroundRemover.vue'
import WatermarkGenerator from '@/views/ImageTools/WatermarkGenerator.vue'
import ColorPaletteGenerator from '@/views/ImageTools/ColorPaletteGenerator.vue'
import ColorPicker from '@/views/ImageTools/ColorPicker.vue'
import ContrastChecker from '@/views/ImageTools/ContrastChecker.vue'
import QrCodeGenerator from '@/views/ImageTools/QrCodeGenerator.vue'
import FaviconGenerator from '@/views/ImageTools/FaviconGenerator.vue'
import BarcodeGenerator from '@/views/ImageTools/BarcodeGenerator.vue'

export const imageToolsRoutes: RouteRecordRaw[] = [
  {
    path: '/image/imageCompressor',
    name: 'ImageCompressor',
    component: ImageCompressor,
    meta: { isFavoritable: true },
  },
  {
    path: '/image/imageCropRotate',
    name: 'ImageCropRotate',
    component: ImageCropRotate,
    meta: { isFavoritable: true },
  },
  {
    path: '/image/gifFrameExtractor',
    name: 'GifFrameExtractor',
    component: GifFrameExtractor,
    meta: { isFavoritable: true },
  },
  {
    path: '/image/backgroundRemover',
    name: 'BackgroundRemover',
    component: BackgroundRemover,
    meta: { isFavoritable: true },
  },
  {
    path: '/image/watermarkGenerator',
    name: 'WatermarkGenerator',
    component: WatermarkGenerator,
    meta: { isFavoritable: true },
  },
  {
    path: '/image/qrCodeGenerator',
    name: 'QrCodeGenerator',
    component: QrCodeGenerator,
    meta: { isFavoritable: true },
  },
  {
    path: '/image/colorPaletteGenerator',
    name: 'ColorPaletteGenerator',
    component: ColorPaletteGenerator,
    meta: { isFavoritable: true },
  },
  {
    path: '/image/colorPicker',
    name: 'ColorPicker',
    component: ColorPicker,
    meta: { isFavoritable: true },
  },
  {
    path: '/image/contrastChecker',
    name: 'ContrastChecker',
    component: ContrastChecker,
    meta: { isFavoritable: true },
  },
  {
    path: '/image/faviconGenerator',
    name: 'FaviconGenerator',
    component: FaviconGenerator,
    meta: { isFavoritable: true },
  },
  {
    path: '/image/barcodeGenerator',
    name: 'BarcodeGenerator',
    component: BarcodeGenerator,
    meta: { isFavoritable: true },
  },
]
