<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Play rock paper scissors against the computer. Choose your move and see if you can win!
    </p>
    <Card class="route-transition-animation w-full max-w-2xl rounded-2xl shadow-lg">
      <CardHeader class="space-y-1">
        <CardTitle class="flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="mdi:hand-back-right" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          Rock Paper Scissors
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="flex flex-col items-center gap-6">
          <!-- Mode Toggle -->
          <div class="bg-muted/30 hover:bg-muted/50 w-full rounded-lg border p-4 transition-all">
            <div class="flex items-center justify-between">
              <Label class="flex items-center gap-2 text-sm font-medium">
                <Icon
                  :icon="twoPlayerMode ? 'mdi:account-multiple' : 'mdi:robot'"
                  class="text-primary"
                />
                {{ twoPlayerMode ? 'Two Player Mode' : 'vs Computer' }}
              </Label>
              <Switch :checked="twoPlayerMode" @update:checked="toggleMode" />
            </div>
          </div>

          <!-- Waiting Message -->
          <div v-if="waitingForPlayer2" class="animate-pulse text-center">
            <p class="text-primary text-lg font-bold">Player 2's Turn! 👤</p>
            <p class="text-muted-foreground text-sm">Make your choice...</p>
          </div>

          <!-- Result Display -->
          <div v-if="result && !waitingForPlayer2" class="text-center">
            <p
              class="animate-result-text mb-4 text-3xl font-bold"
              :class="
                result === 'win'
                  ? 'text-green-600'
                  : result === 'lose'
                    ? 'text-red-600'
                    : 'text-yellow-600'
              "
            >
              {{ resultText }}
            </p>
            <div class="flex items-center justify-center gap-6 text-4xl">
              <div class="animate-bounce-in text-center">
                <div class="relative">
                  <Icon
                    :icon="getIcon(playerChoice!)"
                    class="h-20 w-20 transition-transform hover:scale-110"
                  />
                  <div v-if="result === 'win'" class="absolute -top-2 -right-2 text-2xl">🏆</div>
                </div>
                <p class="mt-2 text-sm font-semibold">
                  {{ twoPlayerMode ? 'Player 1' : 'You' }}
                </p>
              </div>
              <span class="text-muted-foreground text-3xl font-bold">vs</span>
              <div class="animate-bounce-in-delay text-center">
                <div class="relative">
                  <Icon
                    :icon="getIcon(twoPlayerMode ? player2Choice! : computerChoice!)"
                    class="h-20 w-20 transition-transform hover:scale-110"
                  />
                  <div v-if="result === 'lose'" class="absolute -top-2 -right-2 text-2xl">🏆</div>
                </div>
                <p class="mt-2 text-sm font-semibold">
                  {{ twoPlayerMode ? 'Player 2' : 'Computer' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Choice Buttons -->
          <div class="grid w-full grid-cols-3 gap-3">
            <Button
              @click="play('rock')"
              :disabled="playing && !waitingForPlayer2"
              variant="outline"
              class="h-28 flex-col transition-all hover:scale-105 hover:shadow-lg"
            >
              <Icon icon="fa-solid:hand-rock" class="mb-2 h-10 w-10" />
              <span class="font-semibold">Rock</span>
            </Button>
            <Button
              @click="play('paper')"
              :disabled="playing && !waitingForPlayer2"
              variant="outline"
              class="h-28 flex-col transition-all hover:scale-105 hover:shadow-lg"
            >
              <Icon icon="mdi:hand-back-right" class="mb-2 h-10 w-10" />
              <span class="font-semibold">Paper</span>
            </Button>
            <Button
              @click="play('scissors')"
              :disabled="playing && !waitingForPlayer2"
              variant="outline"
              class="h-28 flex-col transition-all hover:scale-105 hover:shadow-lg"
            >
              <Icon icon="mdi:hand-peace" class="mb-2 h-10 w-10" />
              <span class="font-semibold">Scissors</span>
            </Button>
          </div>

          <!-- Score Display -->
          <div
            v-if="
              (twoPlayerMode
                ? score2Player.player1 + score2Player.player2 + score2Player.draws
                : score.wins + score.losses + score.draws) > 0
            "
            class="border-primary/20 from-primary/5 to-primary/10 w-full space-y-3 rounded-lg border-2 bg-gradient-to-br p-4"
          >
            <div v-if="twoPlayerMode" class="grid grid-cols-3 gap-3 text-center">
              <div>
                <p class="text-muted-foreground text-sm">Player 1</p>
                <p class="text-2xl font-bold text-blue-600">{{ score2Player.player1 }}</p>
              </div>
              <div>
                <p class="text-muted-foreground text-sm">Draws</p>
                <p class="text-2xl font-bold text-yellow-600">{{ score2Player.draws }}</p>
              </div>
              <div>
                <p class="text-muted-foreground text-sm">Player 2</p>
                <p class="text-2xl font-bold text-purple-600">{{ score2Player.player2 }}</p>
              </div>
            </div>
            <div v-else class="grid grid-cols-3 gap-3 text-center">
              <div>
                <p class="text-muted-foreground text-sm">Wins</p>
                <p class="text-2xl font-bold text-green-600">{{ score.wins }}</p>
              </div>
              <div>
                <p class="text-muted-foreground text-sm">Draws</p>
                <p class="text-2xl font-bold text-yellow-600">{{ score.draws }}</p>
              </div>
              <div>
                <p class="text-muted-foreground text-sm">Losses</p>
                <p class="text-2xl font-bold text-red-600">{{ score.losses }}</p>
              </div>
            </div>
            <Button @click="showGraph = !showGraph" variant="ghost" size="sm" class="w-full">
              <Icon :icon="showGraph ? 'mdi:chart-bar-off' : 'mdi:chart-bar'" class="mr-2" />
              {{ showGraph ? 'Hide' : 'Show' }} Distribution
            </Button>
            <div v-if="showGraph" class="animate-fade-in space-y-3">
              <div class="space-y-2">
                <div class="flex items-center justify-between text-sm">
                  <span class="flex items-center gap-1.5">
                    <div class="h-3 w-3 rounded-full bg-green-500"></div>
                    {{ twoPlayerMode ? 'Player 1' : 'Wins' }}
                  </span>
                  <span class="font-bold">{{ winPercentage.toFixed(1) }}%</span>
                </div>
                <div class="bg-muted relative h-6 w-full overflow-hidden rounded-full">
                  <div
                    class="absolute inset-y-0 left-0 bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
                    :style="{ width: `${winPercentage}%` }"
                  ></div>
                </div>
              </div>
              <div class="space-y-2">
                <div class="flex items-center justify-between text-sm">
                  <span class="flex items-center gap-1.5">
                    <div class="h-3 w-3 rounded-full bg-yellow-500"></div>
                    Draws
                  </span>
                  <span class="font-bold">{{ drawPercentage.toFixed(1) }}%</span>
                </div>
                <div class="bg-muted relative h-6 w-full overflow-hidden rounded-full">
                  <div
                    class="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-500"
                    :style="{ width: `${drawPercentage}%` }"
                  ></div>
                </div>
              </div>
              <div class="space-y-2">
                <div class="flex items-center justify-between text-sm">
                  <span class="flex items-center gap-1.5">
                    <div class="h-3 w-3 rounded-full bg-red-500"></div>
                    {{ twoPlayerMode ? 'Player 2' : 'Losses' }}
                  </span>
                  <span class="font-bold">{{ losePercentage.toFixed(1) }}%</span>
                </div>
                <div class="bg-muted relative h-6 w-full overflow-hidden rounded-full">
                  <div
                    class="absolute inset-y-0 left-0 bg-gradient-to-r from-red-400 to-red-600 transition-all duration-500"
                    :style="{ width: `${losePercentage}%` }"
                  ></div>
                </div>
              </div>
              <div class="border-primary/20 mt-3 rounded-lg border p-3">
                <Label class="mb-2 flex items-center gap-2 text-xs font-medium">
                  <Icon icon="mdi:history" class="text-primary" />
                  Last 20 Games
                </Label>
                <div class="flex flex-wrap gap-1">
                  <div
                    v-for="(game, index) in history.slice(-20).reverse()"
                    :key="index"
                    class="flex h-7 w-7 items-center justify-center rounded-full border-2"
                    :class="[
                      game === 'win'
                        ? 'border-green-500 bg-green-500/20'
                        : game === 'lose'
                          ? 'border-red-500 bg-red-500/20'
                          : 'border-yellow-500 bg-yellow-500/20',
                    ]"
                    :title="game"
                  >
                    <span
                      class="text-xs font-bold"
                      :class="[
                        game === 'win'
                          ? 'text-green-700'
                          : game === 'lose'
                            ? 'text-red-700'
                            : 'text-yellow-700',
                      ]"
                    >
                      {{ game === 'win' ? 'W' : game === 'lose' ? 'L' : 'D' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <Button @click="reset" variant="outline" size="sm" class="w-full">
              <Icon icon="mdi:refresh" class="mr-2" />
              Reset Score
            </Button>
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
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

type Choice = 'rock' | 'paper' | 'scissors'
type Result = 'win' | 'lose' | 'draw'

const playerChoice = ref<Choice | null>(null)
const computerChoice = ref<Choice | null>(null)
const player2Choice = ref<Choice | null>(null)
const result = ref<Result | null>(null)
const playing = ref(false)
const twoPlayerMode = ref(false)
const waitingForPlayer2 = ref(false)
const showGraph = ref(false)
const score = ref({ wins: 0, losses: 0, draws: 0 })
const score2Player = ref({ player1: 0, player2: 0, draws: 0 })
const history = ref<Result[]>([])

const resultText = computed(() => {
  if (twoPlayerMode.value) {
    if (result.value === 'win') return 'Player 1 Wins! 🎉'
    if (result.value === 'lose') return 'Player 2 Wins! 🎉'
    return 'Draw! 🤝'
  }
  if (result.value === 'win') return 'You Win! 🎉'
  if (result.value === 'lose') return 'You Lose! 😢'
  return 'Draw! 🤝'
})

const winPercentage = computed(() => {
  if (history.value.length === 0) return 0
  const wins = history.value.filter((r) => r === 'win').length
  return (wins / history.value.length) * 100
})

const losePercentage = computed(() => {
  if (history.value.length === 0) return 0
  const losses = history.value.filter((r) => r === 'lose').length
  return (losses / history.value.length) * 100
})

const drawPercentage = computed(() => {
  if (history.value.length === 0) return 0
  const draws = history.value.filter((r) => r === 'draw').length
  return (draws / history.value.length) * 100
})

function getIcon(choice: Choice): string {
  if (choice === 'rock') return 'fa-solid:hand-rock'
  if (choice === 'paper') return 'mdi:hand-back-right'
  return 'mdi:hand-peace'
}

function play(choice: Choice) {
  if (twoPlayerMode.value) {
    if (!waitingForPlayer2.value) {
      // Clear previous round only when starting new game
      result.value = null
      playerChoice.value = null
      computerChoice.value = null
      player2Choice.value = null

      // Player 1 makes choice
      playerChoice.value = choice
      waitingForPlayer2.value = true
      playing.value = true
    } else {
      // Player 2 makes choice
      player2Choice.value = choice
      setTimeout(() => {
        evaluateGame(playerChoice.value!, player2Choice.value!)
        waitingForPlayer2.value = false
        playing.value = false
      }, 300)
    }
  } else {
    // Clear previous round
    result.value = null
    playerChoice.value = null
    computerChoice.value = null
    player2Choice.value = null

    // Single player vs computer
    playing.value = true
    playerChoice.value = choice

    setTimeout(() => {
      const choices: Choice[] = ['rock', 'paper', 'scissors']
      computerChoice.value = choices[Math.floor(Math.random() * 3)]
      evaluateGame(playerChoice.value!, computerChoice.value!)
      playing.value = false
    }, 500)
  }
}

function evaluateGame(choice1: Choice, choice2: Choice) {
  if (choice1 === choice2) {
    result.value = 'draw'
    if (twoPlayerMode.value) {
      score2Player.value.draws++
    } else {
      score.value.draws++
    }
  } else if (
    (choice1 === 'rock' && choice2 === 'scissors') ||
    (choice1 === 'paper' && choice2 === 'rock') ||
    (choice1 === 'scissors' && choice2 === 'paper')
  ) {
    result.value = 'win'
    if (twoPlayerMode.value) {
      score2Player.value.player1++
    } else {
      score.value.wins++
    }
  } else {
    result.value = 'lose'
    if (twoPlayerMode.value) {
      score2Player.value.player2++
    } else {
      score.value.losses++
    }
  }
  history.value.push(result.value)
}

function reset() {
  score.value = { wins: 0, losses: 0, draws: 0 }
  score2Player.value = { player1: 0, player2: 0, draws: 0 }
  history.value = []
  result.value = null
  playerChoice.value = null
  computerChoice.value = null
  player2Choice.value = null
  waitingForPlayer2.value = false
  playing.value = false
}

function toggleMode() {
  twoPlayerMode.value = !twoPlayerMode.value
  reset()
}
</script>

<style scoped>
@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.3) translateY(-20px);
  }
  50% {
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes bounce-in-delay {
  0% {
    opacity: 0;
    transform: scale(0.3) translateY(-20px);
  }
  50% {
    opacity: 0;
    transform: scale(0.3) translateY(-20px);
  }
  75% {
    transform: scale(1.05);
  }
  88% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes result-text {
  0% {
    opacity: 0;
    transform: scale(0.5) translateY(-20px);
  }
  70% {
    opacity: 0;
    transform: scale(0.5) translateY(-20px);
  }
  85% {
    transform: scale(1.1) translateY(0);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-bounce-in {
  animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.animate-bounce-in-delay {
  animation: bounce-in-delay 1s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.animate-result-text {
  animation: result-text 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}
</style>
