<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Calculate Unix file permissions easily. Convert between numeric (chmod 755) and symbolic
      (rwxr-xr-x) notation.
    </p>
    <Card class="route-transition-animation w-full max-w-xl rounded-2xl shadow-lg">
      <CardHeader class="space-y-1">
        <CardTitle class="flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="mdi:shield-lock" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          Chmod Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid gap-6">
          <!-- Permission Groups -->
          <div
            v-for="group in permissionGroups"
            :key="group.key"
            class="bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-all"
          >
            <Label class="mb-3 flex items-center gap-2 text-sm font-medium">
              <Icon :icon="group.icon" class="text-primary" />
              {{ group.label }}
            </Label>
            <div class="grid grid-cols-3 gap-2">
              <label
                v-for="perm in permissionTypes"
                :key="perm.key"
                :for="`${group.key}-${perm.key}`"
                class="flex cursor-pointer items-center gap-2"
              >
                <Checkbox
                  :id="`${group.key}-${perm.key}`"
                  v-model="permissions[group.key][perm.key]"
                />
                <span class="text-sm">{{ perm.label }} ({{ perm.value }})</span>
              </label>
            </div>
          </div>

          <!-- Results -->
          <div
            class="border-primary/20 from-primary/5 to-primary/10 space-y-3 rounded-lg border-2 bg-gradient-to-br p-4"
          >
            <div class="flex items-center justify-between text-lg">
              <span class="flex items-center gap-2 font-medium">
                <Icon icon="mdi:numeric" class="text-primary" />
                Numeric:
              </span>
              <span class="text-primary font-mono text-2xl font-bold">{{ numericPermission }}</span>
            </div>
            <div class="flex items-center justify-between text-lg">
              <span class="flex items-center gap-2 font-medium">
                <Icon icon="mdi:code-string" class="text-primary" />
                Symbolic:
              </span>
              <span class="font-mono text-xl font-bold">{{ symbolicPermission }}</span>
            </div>
            <div class="flex items-center justify-between text-lg">
              <span class="flex items-center gap-2 font-medium">
                <Icon icon="mdi:console" class="text-primary" />
                Command:
              </span>
              <div class="flex items-center gap-2">
                <code class="bg-background rounded px-2 py-1 font-mono text-sm"
                  >chmod {{ numericPermission }} &lt;file&gt;</code
                >
                <Button @click="copyCommand" variant="ghost" size="icon" class="h-7 w-7">
                  <Icon
                    :icon="isCopied ? 'mdi:check' : 'mdi:content-copy'"
                    class="h-4 w-4"
                    :class="isCopied ? 'text-green-500' : ''"
                  />
                </Button>
              </div>
            </div>
          </div>

          <!-- Quick Presets -->
          <div class="bg-muted/30 rounded-lg border p-4">
            <Label class="mb-3 flex items-center gap-2 text-sm font-medium">
              <Icon icon="mdi:lightning-bolt" class="text-primary" />
              Quick Presets
            </Label>
            <div class="grid grid-cols-2 gap-2">
              <Button
                v-for="preset in presets"
                :key="preset.value"
                @click="setPreset(preset.value)"
                variant="outline"
                size="sm"
              >
                <Icon :icon="preset.icon" class="mr-2" />
                {{ preset.value }} ({{ preset.symbolic }})
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

interface PermissionSet {
  read: boolean
  write: boolean
  execute: boolean
}

interface Permissions {
  owner: PermissionSet
  group: PermissionSet
  others: PermissionSet
}

const permissions = reactive<Permissions>({
  owner: { read: false, write: false, execute: false },
  group: { read: false, write: false, execute: false },
  others: { read: false, write: false, execute: false },
})

const isCopied = ref(false)

const permissionGroups = [
  { key: 'owner' as const, label: 'Owner', icon: 'mdi:account' },
  { key: 'group' as const, label: 'Group', icon: 'mdi:account-group' },
  { key: 'others' as const, label: 'Others', icon: 'mdi:account-multiple' },
]

const permissionTypes = [
  { key: 'read' as const, label: 'Read', value: 4 },
  { key: 'write' as const, label: 'Write', value: 2 },
  { key: 'execute' as const, label: 'Execute', value: 1 },
]

const presets = [
  { value: 755, symbolic: 'rwxr-xr-x', icon: 'mdi:file-code' },
  { value: 644, symbolic: 'rw-r--r--', icon: 'mdi:file-document' },
  { value: 777, symbolic: 'rwxrwxrwx', icon: 'mdi:file-lock-open' },
  { value: 600, symbolic: 'rw-------', icon: 'mdi:file-lock' },
]

function calculateValue(permSet: PermissionSet): number {
  let value = 0
  if (permSet.read) value += 4
  if (permSet.write) value += 2
  if (permSet.execute) value += 1
  return value
}

const numericPermission = computed(() => {
  const ownerVal = calculateValue(permissions.owner)
  const groupVal = calculateValue(permissions.group)
  const othersVal = calculateValue(permissions.others)
  return `${ownerVal}${groupVal}${othersVal}`
})

function getSymbolic(permSet: PermissionSet): string {
  return (permSet.read ? 'r' : '-') + (permSet.write ? 'w' : '-') + (permSet.execute ? 'x' : '-')
}

const symbolicPermission = computed(() => {
  return (
    getSymbolic(permissions.owner) +
    getSymbolic(permissions.group) +
    getSymbolic(permissions.others)
  )
})

function setPreset(value: number) {
  const str = value.toString().padStart(3, '0')
  const groups: (keyof Permissions)[] = ['owner', 'group', 'others']

  groups.forEach((group, index) => {
    const val = parseInt(str[index])
    permissions[group].read = (val & 4) !== 0
    permissions[group].write = (val & 2) !== 0
    permissions[group].execute = (val & 1) !== 0
  })
}

async function copyCommand() {
  try {
    await navigator.clipboard.writeText(`chmod ${numericPermission.value} <file>`)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>
