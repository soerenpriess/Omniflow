<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Look up HTTP status codes and their meanings. Enter a status code or search by description to
      find the information you need.
    </p>
    <Card class="route-transition-animation w-full max-w-xl rounded-2xl shadow-lg">
      <CardHeader class="space-y-1">
        <CardTitle class="flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="mdi:web" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          HTTP Status Code Lookup
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4">
          <!-- Search -->
          <div class="bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-all">
            <Label for="search" class="mb-2 flex items-center gap-2 text-sm font-medium">
              <Icon icon="mdi:magnify" class="text-primary" />
              Search Status Code or Description
            </Label>
            <Input
              id="search"
              v-model="searchQuery"
              type="text"
              placeholder="e.g., 404 or Not Found"
              class="bg-background text-lg font-medium"
            />
          </div>
        </div>

        <!-- Status Codes List -->
        <div class="mt-6 grid max-h-[500px] gap-2 overflow-y-auto pr-2">
          <div
            v-for="status in filteredStatuses"
            :key="status.code"
            class="bg-muted/30 hover:bg-muted/50 rounded-lg border p-3 transition-all"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex-1">
                <div class="mb-1.5 flex items-center gap-2">
                  <span
                    class="rounded-md px-2 py-0.5 font-mono text-sm font-bold"
                    :class="getStatusColor(status.code)"
                  >
                    {{ status.code }}
                  </span>
                  <span class="text-base font-semibold">{{ status.name }}</span>
                </div>
                <p class="text-muted-foreground text-xs leading-relaxed">
                  {{ status.description }}
                </p>
                <div v-if="status.example" class="mt-1.5">
                  <p class="text-[10px] font-medium">Example:</p>
                  <p class="text-muted-foreground text-[10px] leading-relaxed italic">
                    {{ status.example }}
                  </p>
                </div>
              </div>
              <Icon :icon="getStatusIcon(status.code)" class="text-primary h-5 w-5 flex-shrink-0" />
            </div>
          </div>
          <div v-if="filteredStatuses.length === 0" class="py-8 text-center">
            <Icon icon="mdi:magnify-close" class="text-muted-foreground mx-auto mb-2 h-12 w-12" />
            <p class="text-muted-foreground">No status codes found matching your search.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const searchQuery = ref('')

const statusCodes = [
  {
    code: 200,
    name: 'OK',
    description: 'The request succeeded.',
    example: 'Successful GET request',
  },
  {
    code: 201,
    name: 'Created',
    description: 'The request succeeded and a new resource was created.',
    example: 'Successful POST request creating a resource',
  },
  {
    code: 204,
    name: 'No Content',
    description: 'The request succeeded but there is no content to return.',
    example: 'Successful DELETE request',
  },
  {
    code: 301,
    name: 'Moved Permanently',
    description: 'The resource has been permanently moved to a new URL.',
    example: 'Old URL redirects to new URL',
  },
  {
    code: 302,
    name: 'Found',
    description: 'The resource is temporarily at a different URL.',
    example: 'Temporary redirect',
  },
  {
    code: 304,
    name: 'Not Modified',
    description: 'The resource has not been modified since last request.',
    example: 'Cached response is still valid',
  },
  {
    code: 400,
    name: 'Bad Request',
    description: 'The server cannot process the request due to client error.',
    example: 'Invalid JSON in request body',
  },
  {
    code: 401,
    name: 'Unauthorized',
    description: 'Authentication is required and has failed or not been provided.',
    example: 'Missing or invalid API key',
  },
  {
    code: 403,
    name: 'Forbidden',
    description: 'The server understands the request but refuses to authorize it.',
    example: 'User lacks permissions',
  },
  {
    code: 404,
    name: 'Not Found',
    description: 'The server cannot find the requested resource.',
    example: 'Page or endpoint does not exist',
  },
  {
    code: 405,
    name: 'Method Not Allowed',
    description: 'The request method is not supported for this resource.',
    example: 'POST to a GET-only endpoint',
  },
  {
    code: 408,
    name: 'Request Timeout',
    description: 'The server timed out waiting for the request.',
    example: 'Client took too long to send request',
  },
  {
    code: 409,
    name: 'Conflict',
    description: 'The request conflicts with the current state of the server.',
    example: 'Duplicate entry in database',
  },
  {
    code: 429,
    name: 'Too Many Requests',
    description: 'The user has sent too many requests in a given time.',
    example: 'Rate limit exceeded',
  },
  {
    code: 500,
    name: 'Internal Server Error',
    description: 'The server encountered an unexpected condition.',
    example: 'Unhandled exception in code',
  },
  {
    code: 501,
    name: 'Not Implemented',
    description: 'The server does not support the functionality required.',
    example: 'Feature not yet implemented',
  },
  {
    code: 502,
    name: 'Bad Gateway',
    description: 'The server received an invalid response from upstream.',
    example: 'Backend service is down',
  },
  {
    code: 503,
    name: 'Service Unavailable',
    description: 'The server is not ready to handle the request.',
    example: 'Server maintenance or overload',
  },
  {
    code: 504,
    name: 'Gateway Timeout',
    description: 'The server did not get a response in time from upstream.',
    example: 'Backend service timeout',
  },
]

const filteredStatuses = computed(() => {
  if (!searchQuery.value.trim()) return statusCodes

  const query = searchQuery.value.toLowerCase()
  return statusCodes.filter(
    (status) =>
      status.code.toString().includes(query) ||
      status.name.toLowerCase().includes(query) ||
      status.description.toLowerCase().includes(query),
  )
})

function getStatusColor(code: number): string {
  if (code >= 200 && code < 300) return 'bg-green-500/20 text-green-700 dark:text-green-400'
  if (code >= 300 && code < 400) return 'bg-blue-500/20 text-blue-700 dark:text-blue-400'
  if (code >= 400 && code < 500) return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
  if (code >= 500) return 'bg-red-500/20 text-red-700 dark:text-red-400'
  return 'bg-gray-500/20 text-gray-700 dark:text-gray-400'
}

function getStatusIcon(code: number): string {
  if (code >= 200 && code < 300) return 'mdi:check-circle'
  if (code >= 300 && code < 400) return 'mdi:arrow-right-circle'
  if (code >= 400 && code < 500) return 'mdi:alert-circle'
  if (code >= 500) return 'mdi:close-circle'
  return 'mdi:information'
}
</script>
