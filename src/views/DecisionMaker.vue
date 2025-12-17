<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Can't make a decision? Let fate decide! Ask a question and get a random answer.
    </p>
    <Card class="route-transition-animation w-full max-w-xl rounded-2xl shadow-lg">
      <CardHeader class="space-y-1">
        <CardTitle class="flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="mdi:help-circle" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          Decision Maker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="flex flex-col items-center gap-6">
          <div class="bg-muted/30 hover:bg-muted/50 w-full rounded-lg border p-4 transition-all">
            <Label for="question" class="mb-2 flex items-center gap-2 text-sm font-medium">
              <Icon icon="mdi:comment-question" class="text-primary" />
              Your Question
            </Label>
            <Input
              id="question"
              v-model="question"
              type="text"
              placeholder="Should I...?"
              class="bg-background text-lg font-medium"
            />
          </div>
          <div
            v-if="answer"
            class="flex h-48 w-48 items-center justify-center rounded-full border-4 p-8 transition-all"
            :class="answerColor"
          >
            <div class="text-center">
              <Icon :icon="answerIcon" class="mx-auto mb-2 h-12 w-12" />
              <p class="text-2xl font-bold">{{ answer }}</p>
            </div>
          </div>
          <div
            v-else
            class="bg-muted/30 flex h-48 w-48 items-center justify-center rounded-full border-4"
          >
            <Icon icon="mdi:help-circle-outline" class="text-muted-foreground h-24 w-24" />
          </div>
          <Button @click="decide" class="h-12 w-full text-lg font-semibold">
            <Icon icon="mdi:sync" class="mr-2" />
            Make Decision
          </Button>
          <div class="bg-muted/30 w-full rounded-lg border p-4">
            <Label class="mb-2 flex items-center gap-2 text-sm font-medium">
              <Icon icon="mdi:cog" class="text-primary" />
              Decision Type
            </Label>
            <div class="grid grid-cols-2 gap-2">
              <Button
                @click="decisionType = 'yesno'"
                :variant="decisionType === 'yesno' ? 'default' : 'outline'"
                size="sm"
              >
                Yes/No
              </Button>
              <Button
                @click="decisionType = 'magic8'"
                :variant="decisionType === 'magic8' ? 'default' : 'outline'"
                size="sm"
              >
                Magic 8-Ball
              </Button>
            </div>
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
import { Button } from '@/components/ui/button'

const question = ref('')
const answer = ref('')
const decisionType = ref<'yesno' | 'magic8'>('yesno')

const yesNoAnswers = [
  { text: 'Yes', color: 'border-green-500 bg-green-500/20', icon: 'mdi:check-circle' },
  { text: 'No', color: 'border-red-500 bg-red-500/20', icon: 'mdi:close-circle' },
  { text: 'Maybe', color: 'border-yellow-500 bg-yellow-500/20', icon: 'mdi:help-circle' },
]

const magic8Answers = [
  { text: 'It is certain', color: 'border-green-500 bg-green-500/20', icon: 'mdi:check-circle' },
  { text: 'Without a doubt', color: 'border-green-500 bg-green-500/20', icon: 'mdi:check-circle' },
  { text: 'Yes definitely', color: 'border-green-500 bg-green-500/20', icon: 'mdi:check-circle' },
  { text: 'Most likely', color: 'border-green-500 bg-green-500/20', icon: 'mdi:thumb-up' },
  {
    text: 'Ask again later',
    color: 'border-yellow-500 bg-yellow-500/20',
    icon: 'mdi:clock-outline',
  },
  {
    text: 'Cannot predict now',
    color: 'border-yellow-500 bg-yellow-500/20',
    icon: 'mdi:help-circle',
  },
  { text: "Don't count on it", color: 'border-red-500 bg-red-500/20', icon: 'mdi:close-circle' },
  { text: 'My sources say no', color: 'border-red-500 bg-red-500/20', icon: 'mdi:close-circle' },
  { text: 'Outlook not so good', color: 'border-red-500 bg-red-500/20', icon: 'mdi:alert-circle' },
]

const answerColor = computed(() => {
  const answers = decisionType.value === 'yesno' ? yesNoAnswers : magic8Answers
  const found = answers.find((a) => a.text === answer.value)
  return found?.color || ''
})

const answerIcon = computed(() => {
  const answers = decisionType.value === 'yesno' ? yesNoAnswers : magic8Answers
  const found = answers.find((a) => a.text === answer.value)
  return found?.icon || 'mdi:help-circle'
})

function decide() {
  const answers = decisionType.value === 'yesno' ? yesNoAnswers : magic8Answers
  const randomAnswer = answers[Math.floor(Math.random() * answers.length)]
  answer.value = randomAnswer.text
}
</script>
