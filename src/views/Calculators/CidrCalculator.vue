<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Calculate IP ranges from CIDR notation
    </p>
    <Card class="route-transition-animation mb-4 w-full max-w-4xl rounded-2xl shadow-lg sm:mb-8">
      <CardHeader class="pb-2 sm:pb-3">
        <CardTitle
          class="flex items-center gap-1.5 text-base font-semibold sm:gap-2 sm:text-lg lg:text-xl"
        >
          <Icon icon="mdi:network" class="text-primary h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
          CIDR Calculator
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-2.5 sm:space-y-3">
        <!-- Input -->
        <div class="space-y-1.5">
          <Label class="text-[10px] sm:text-xs">CIDR Notation</Label>
          <Input
            v-model="cidrInput"
            placeholder="192.168.1.0/24"
            class="h-8 font-mono text-[10px] sm:h-9 sm:text-xs"
            @input="calculate"
          />
          <p v-if="error" class="text-[9px] text-red-500 sm:text-[10px]">{{ error }}</p>
        </div>

        <!-- Results -->
        <div v-if="result && !error" class="space-y-2.5">
          <!-- Network Information -->
          <div class="space-y-1.5">
            <Label class="text-[10px] sm:text-xs">Network Information</Label>
            <div class="bg-muted/30 border-muted-foreground/20 rounded-lg border p-2.5 sm:p-3">
              <div class="grid grid-cols-2 gap-2 text-[9px] sm:text-[12px]">
                <div>
                  <span class="text-muted-foreground">Network Address:</span>
                  <span class="ml-1 font-mono font-semibold">{{ result.networkAddress }}</span>
                </div>
                <div>
                  <span class="text-muted-foreground">Broadcast Address:</span>
                  <span class="ml-1 font-mono font-semibold">{{ result.broadcastAddress }}</span>
                </div>
                <div>
                  <span class="text-muted-foreground">First Host:</span>
                  <span class="ml-1 font-mono font-semibold">{{ result.firstHost }}</span>
                </div>
                <div>
                  <span class="text-muted-foreground">Last Host:</span>
                  <span class="ml-1 font-mono font-semibold">{{ result.lastHost }}</span>
                </div>
                <div>
                  <span class="text-muted-foreground">Subnet Mask:</span>
                  <span class="ml-1 font-mono font-semibold">{{ result.subnetMask }}</span>
                </div>
                <div>
                  <span class="text-muted-foreground">Wildcard Mask:</span>
                  <span class="ml-1 font-mono font-semibold">{{ result.wildcardMask }}</span>
                </div>
                <div>
                  <span class="text-muted-foreground">Total Hosts:</span>
                  <span class="ml-1 font-mono font-semibold">{{ result.totalHosts }}</span>
                </div>
                <div>
                  <span class="text-muted-foreground">Usable Hosts:</span>
                  <span class="ml-1 font-mono font-semibold">{{ result.usableHosts }}</span>
                </div>
                <div class="col-span-2">
                  <span class="text-muted-foreground">IP Range:</span>
                  <span class="ml-1 font-mono font-semibold"
                    >{{ result.firstHost }} - {{ result.lastHost }}</span
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Binary Representation -->
          <div class="space-y-1.5">
            <Label class="text-[10px] sm:text-xs">Binary Representation</Label>
            <div class="bg-muted/30 border-muted-foreground/20 rounded-lg border p-2.5 sm:p-3">
              <div class="space-y-1 font-mono text-[9px] sm:text-[12px]">
                <div>
                  <span class="text-muted-foreground">IP Address:</span>
                  <span class="ml-2">{{ result.binaryIP }}</span>
                </div>
                <div>
                  <span class="text-muted-foreground">Subnet Mask:</span>
                  <span class="ml-2">{{ result.binaryMask }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- IP Class -->
          <div class="space-y-1.5">
            <Label class="text-[10px] sm:text-xs">Additional Information</Label>
            <div class="bg-primary/10 border-primary/20 rounded-lg border p-2.5 sm:p-3">
              <div class="grid grid-cols-2 gap-2 text-[9px] sm:text-[12px]">
                <div>
                  <span class="text-muted-foreground">IP Class:</span>
                  <span class="ml-1 font-semibold">{{ result.ipClass }}</span>
                </div>
                <div>
                  <span class="text-muted-foreground">Type:</span>
                  <span class="ml-1 font-semibold">{{ result.type }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Icon } from '@iconify/vue'

const cidrInput = ref('192.168.1.0/24')
const error = ref('')

interface CIDRResult {
  networkAddress: string
  broadcastAddress: string
  firstHost: string
  lastHost: string
  subnetMask: string
  wildcardMask: string
  totalHosts: number
  usableHosts: number
  binaryIP: string
  binaryMask: string
  ipClass: string
  type: string
}

const result = ref<CIDRResult | null>(null)

function ipToInt(ip: string): number {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0
}

function intToIp(int: number): string {
  return [(int >>> 24) & 255, (int >>> 16) & 255, (int >>> 8) & 255, int & 255].join('.')
}

function ipToBinary(ip: string): string {
  return ip
    .split('.')
    .map((octet) => parseInt(octet).toString(2).padStart(8, '0'))
    .join('.')
}

function getIPClass(firstOctet: number): string {
  if (firstOctet >= 1 && firstOctet <= 126) return 'A'
  if (firstOctet >= 128 && firstOctet <= 191) return 'B'
  if (firstOctet >= 192 && firstOctet <= 223) return 'C'
  if (firstOctet >= 224 && firstOctet <= 239) return 'D (Multicast)'
  if (firstOctet >= 240 && firstOctet <= 255) return 'E (Reserved)'
  return 'Unknown'
}

function getIPType(ip: string): string {
  const octets = ip.split('.').map(Number)
  const first = octets[0]

  if (first === 10) return 'Private (Class A)'
  if (first === 172 && octets[1] >= 16 && octets[1] <= 31) return 'Private (Class B)'
  if (first === 192 && octets[1] === 168) return 'Private (Class C)'
  if (first === 127) return 'Loopback'
  if (first === 169 && octets[1] === 254) return 'Link-Local'
  return 'Public'
}

function calculate() {
  error.value = ''
  result.value = null

  const match = cidrInput.value.match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\/(\d{1,2})$/)
  if (!match) {
    error.value = 'Invalid CIDR notation. Use format: 192.168.1.0/24'
    return
  }

  const [, ip, prefixStr] = match
  const prefix = parseInt(prefixStr)

  // Validate IP
  const octets = ip.split('.').map(Number)
  if (octets.some((octet) => octet < 0 || octet > 255)) {
    error.value = 'Invalid IP address'
    return
  }

  // Validate prefix
  if (prefix < 0 || prefix > 32) {
    error.value = 'Prefix must be between 0 and 32'
    return
  }

  // Calculate subnet mask
  const mask = (~0 << (32 - prefix)) >>> 0
  const subnetMask = intToIp(mask)
  const wildcardMask = intToIp(~mask >>> 0)

  // Calculate network and broadcast
  const ipInt = ipToInt(ip)
  const networkInt = (ipInt & mask) >>> 0
  const broadcastInt = (networkInt | (~mask >>> 0)) >>> 0

  const networkAddress = intToIp(networkInt)
  const broadcastAddress = intToIp(broadcastInt)
  const firstHost = prefix === 32 ? networkAddress : intToIp(networkInt + 1)
  const lastHost = prefix === 32 ? networkAddress : intToIp(broadcastInt - 1)

  const totalHosts = Math.pow(2, 32 - prefix)
  const usableHosts = prefix === 32 ? 1 : prefix === 31 ? 2 : totalHosts - 2

  result.value = {
    networkAddress,
    broadcastAddress,
    firstHost,
    lastHost,
    subnetMask,
    wildcardMask,
    totalHosts,
    usableHosts,
    binaryIP: ipToBinary(networkAddress),
    binaryMask: ipToBinary(subnetMask),
    ipClass: getIPClass(octets[0]),
    type: getIPType(networkAddress),
  }
}

calculate()
</script>
