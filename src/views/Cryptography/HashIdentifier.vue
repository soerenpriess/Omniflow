<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Identify hash types by analyzing format and length
    </p>
    <Card class="route-transition-animation mb-4 w-full max-w-4xl rounded-2xl shadow-lg sm:mb-8">
      <CardHeader class="pb-2 sm:pb-3">
        <CardTitle
          class="flex items-center gap-1.5 text-base font-semibold sm:gap-2 sm:text-lg lg:text-xl"
        >
          <Icon icon="mdi:fingerprint" class="text-primary h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
          Hash Identifier
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-2.5 sm:space-y-3">
        <!-- Input -->
        <div class="space-y-1.5">
          <Label class="text-[10px] sm:text-xs">Hash Value</Label>
          <textarea
            v-model="hashInput"
            placeholder="Enter hash to identify (e.g., 5d41402abc4b2a76b9719d911017c592)"
            class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 font-mono text-[10px] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:text-xs"
            @input="identify"
          />
        </div>

        <!-- Results -->
        <div v-if="results.length > 0" class="space-y-1.5">
          <Label class="text-[10px] sm:text-xs">Possible Hash Types</Label>
          <div class="space-y-2">
            <div
              v-for="(hash, index) in results"
              :key="index"
              class="bg-muted/30 border-muted-foreground/20 flex items-start justify-between rounded-lg border p-2.5 sm:p-3"
            >
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <span class="text-primary text-xs font-semibold sm:text-sm">{{ hash.name }}</span>
                  <span
                    v-if="hash.common"
                    class="bg-primary/20 text-primary rounded px-1.5 py-0.5 text-[8px] font-medium sm:text-[9px]"
                    >Common</span
                  >
                </div>
                <p class="text-muted-foreground mt-0.5 text-[9px] sm:text-[10px]">
                  {{ hash.description }}
                </p>
                <div
                  v-if="hash.examples.length > 0"
                  class="text-muted-foreground mt-1.5 text-[9px] sm:text-[10px]"
                >
                  <span class="font-medium">Example format:</span>
                  <code class="bg-muted ml-1 rounded px-1 py-0.5 font-mono">{{
                    hash.examples[0]
                  }}</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No results -->
        <div
          v-else-if="hashInput.trim() && results.length === 0"
          class="text-muted-foreground border-muted-foreground/20 rounded-lg border border-dashed p-4 text-center text-[10px] sm:text-xs"
        >
          No matching hash types found. The input might be invalid or an uncommon hash format.
        </div>

        <!-- Info -->
        <div class="rounded-lg bg-blue-50 p-2.5 dark:bg-blue-950/20">
          <div
            class="mb-0.5 flex items-center gap-1.5 text-[12px] font-medium text-blue-700 dark:text-blue-300"
          >
            <Icon icon="mdi:information" class="h-3.5 w-3.5" />
            Hash Identification
          </div>
          <p class="text-[9px] leading-tight text-blue-600 sm:text-[10px] dark:text-blue-400">
            This tool identifies hash types based on length and format patterns. Multiple matches
            are possible. For accurate identification, consider the source context.
          </p>
        </div>

        <!-- Supported Hashes -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <Label class="text-[12px] sm:text-xs"
              >Supported Hash Types ({{ hashTypes.length }})</Label
            >
            <div class="flex items-center gap-3 text-[8px] sm:text-[9px]">
              <div class="flex items-center gap-1">
                <Icon icon="mdi:star" class="text-primary h-3 w-3" />
                <span class="text-muted-foreground">Common</span>
              </div>
              <div class="flex items-center gap-1">
                <Icon icon="mdi:star-outline" class="text-muted-foreground h-3 w-3" />
                <span class="text-muted-foreground">Uncommon</span>
              </div>
            </div>
          </div>
          <div
            class="bg-muted/30 border-muted-foreground/20 max-h-[200px] overflow-y-auto rounded-lg border p-2.5 sm:p-3"
          >
            <div class="grid grid-cols-2 gap-x-3 gap-y-1 sm:grid-cols-3 lg:grid-cols-4">
              <div v-for="hash in hashTypes" :key="hash.name" class="flex items-center gap-1.5">
                <Icon
                  :icon="hash.common ? 'mdi:star' : 'mdi:star-outline'"
                  class="h-4 w-4"
                  :class="hash.common ? 'text-primary' : 'text-muted-foreground'"
                />
                <span class="text-[9px] sm:text-[10px]">{{ hash.name }}</span>
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
import { Label } from '@/components/ui/label'
import { Icon } from '@iconify/vue'

const hashInput = ref('')

interface HashType {
  name: string
  description: string
  patterns: RegExp[]
  common: boolean
  examples: string[]
}

const results = ref<HashType[]>([])

const hashTypes: HashType[] = [
  {
    name: 'MD5',
    description: '128-bit hash (32 hex characters)',
    patterns: [/^[a-f0-9]{32}$/i],
    common: true,
    examples: ['5d41402abc4b2a76b9719d911017c592'],
  },
  {
    name: 'SHA-1',
    description: '160-bit hash (40 hex characters)',
    patterns: [/^[a-f0-9]{40}$/i],
    common: true,
    examples: ['aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d'],
  },
  {
    name: 'SHA-224',
    description: '224-bit hash (56 hex characters)',
    patterns: [/^[a-f0-9]{56}$/i],
    common: false,
    examples: ['d14a028c2a3a2bc9476102bb288234c415a2b01f828ea62ac5b3e42f'],
  },
  {
    name: 'SHA-256',
    description: '256-bit hash (64 hex characters)',
    patterns: [/^[a-f0-9]{64}$/i],
    common: true,
    examples: ['2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae'],
  },
  {
    name: 'SHA-384',
    description: '384-bit hash (96 hex characters)',
    patterns: [/^[a-f0-9]{96}$/i],
    common: false,
    examples: [
      '38b060a751ac96384cd9327eb1b1e36a21fdb71114be07434c0cc7bf63f6e1da274edebfe76f65fbd51ad2f14898b95b',
    ],
  },
  {
    name: 'SHA-512',
    description: '512-bit hash (128 hex characters)',
    patterns: [/^[a-f0-9]{128}$/i],
    common: true,
    examples: [
      'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e',
    ],
  },
  {
    name: 'bcrypt',
    description: 'Adaptive hash function for passwords',
    patterns: [/^\$2[aby]?\$\d{2}\$[./A-Za-z0-9]{53}$/],
    common: true,
    examples: ['$2a$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW'],
  },
  {
    name: 'NTLM',
    description: 'Windows NT hash (32 hex characters)',
    patterns: [/^[a-f0-9]{32}$/i],
    common: true,
    examples: ['8846f7eaee8fb117ad06bdd830b7586c'],
  },
  {
    name: 'MySQL5',
    description: 'MySQL 5.x password hash (41 chars with *)',
    patterns: [/^\*[A-F0-9]{40}$/i],
    common: true,
    examples: ['*2470C0C06DEE42FD1618BB99005ADCA2EC9D1E19'],
  },
  {
    name: 'phpBB3',
    description: 'phpBB3 forum software hash',
    patterns: [/^\$H\$[./0-9A-Za-z]{31}$/],
    common: false,
    examples: ['$H$9aaaaaSXBjgypwqm.JsMssPLiS8YQ00'],
  },
  {
    name: 'Wordpress',
    description: 'WordPress password hash (phpass)',
    patterns: [/^\$P\$[./0-9A-Za-z]{31}$/],
    common: true,
    examples: ['$P$B8hXKjW8YjR7C0y3FqozZbDhTZoqLz.'],
  },
  {
    name: 'Joomla',
    description: 'Joomla CMS password hash',
    patterns: [/^[a-f0-9]{32}:[a-zA-Z0-9]{16,32}$/i],
    common: false,
    examples: ['5d41402abc4b2a76b9719d911017c592:6kcS8c1dxGH7sRTz'],
  },
  {
    name: 'SHA-3-224',
    description: 'SHA-3 224-bit hash',
    patterns: [/^[a-f0-9]{56}$/i],
    common: false,
    examples: ['6b4e03423667dbb73b6e15454f0eb1abd4597f9a1b078e3f5b5a6bc7'],
  },
  {
    name: 'SHA-3-256',
    description: 'SHA-3 256-bit hash',
    patterns: [/^[a-f0-9]{64}$/i],
    common: false,
    examples: ['3a985da74fe225b2045c172d6bd390bd855f086e3e9d525b46bfe24511431532'],
  },
  {
    name: 'SHA-3-384',
    description: 'SHA-3 384-bit hash',
    patterns: [/^[a-f0-9]{96}$/i],
    common: false,
    examples: [
      'ec01498288516fc926459f58e2c6ad8df9b473cb0fc08c2596da7cf0e49be4b298d88cea927ac7f539f1edf228376d25',
    ],
  },
  {
    name: 'SHA-3-512',
    description: 'SHA-3 512-bit hash',
    patterns: [/^[a-f0-9]{128}$/i],
    common: false,
    examples: [
      'a69f73cca23a9ac5c8b567dc185a756e97c982164fe25859e0d1dcc1475c80a615b2123af1f5f94c11e3e9402c3ac558f500199d95b6d3e301758586281dcd26',
    ],
  },
  {
    name: 'RIPEMD-160',
    description: '160-bit hash (40 hex characters)',
    patterns: [/^[a-f0-9]{40}$/i],
    common: false,
    examples: ['108f07b8382412612c048d07d13f814118445acd'],
  },
  {
    name: 'Whirlpool',
    description: '512-bit hash (128 hex characters)',
    patterns: [/^[a-f0-9]{128}$/i],
    common: false,
    examples: [
      '19fa61d75522a4669b44e39c1d2e1726c530232130d407f89afee0964997f7a73e83be698b288febcf88e3e03c4f0757ea8964e59b63d93708b138cc42a66eb3',
    ],
  },
  {
    name: 'CRC32',
    description: '32-bit checksum (8 hex characters)',
    patterns: [/^[a-f0-9]{8}$/i],
    common: false,
    examples: ['c622f71d'],
  },
  {
    name: 'LM Hash',
    description: 'LAN Manager hash (32 hex characters)',
    patterns: [/^[a-f0-9]{32}$/i],
    common: false,
    examples: ['e52cac67419a9a224a3b108f3fa6cb6d'],
  },
]

function identify() {
  results.value = []
  const hash = hashInput.value.trim()

  if (!hash) return

  for (const hashType of hashTypes) {
    for (const pattern of hashType.patterns) {
      if (pattern.test(hash)) {
        results.value.push(hashType)
        break
      }
    }
  }

  results.value.sort((a, b) => (b.common ? 1 : 0) - (a.common ? 1 : 0))
}
</script>
