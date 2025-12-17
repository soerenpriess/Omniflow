<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Essential Git commands with examples and explanations
    </p>
    <Card class="route-transition-animation mb-2 w-full max-w-5xl rounded-2xl shadow-lg sm:mb-4">
      <CardHeader class="pb-1 sm:pb-2">
        <CardTitle
          class="flex items-center gap-1.5 text-base font-semibold sm:gap-2 sm:text-lg lg:text-xl"
        >
          <Icon icon="mdi:git" class="text-primary h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
          Git Commands Cheatsheet
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-2">
        <!-- Toolbar -->
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex-1">
            <Input v-model="searchQuery" placeholder="Search commands..." class="text-md h-8">
              <template #prefix>
                <Icon icon="mdi:magnify" class="h-4 w-4" />
              </template>
            </Input>
          </div>
          <Button
            @click="compactView = !compactView"
            variant="outline"
            size="sm"
            class="h-8 gap-1 text-[10px]"
          >
            <Icon :icon="compactView ? 'mdi:view-list' : 'mdi:view-agenda'" class="h-3 w-3" />
            {{ compactView ? 'Detailed' : 'Compact' }}
          </Button>
        </div>

        <!-- Category Tabs -->
        <div class="flex flex-wrap gap-1.5">
          <Button
            v-for="cat in categories"
            :key="cat"
            @click="selectedCategory = cat"
            :variant="selectedCategory === cat ? 'default' : 'outline'"
            size="sm"
            class="h-7 gap-1 text-[12px]"
          >
            <Icon :icon="getCategoryIcon(cat)" class="h-3 w-3" />
            {{ cat }}
            <Badge v-if="cat !== 'All'" variant="secondary" class="ml-1 h-4 px-1 text-[8px]">
              {{ getCommandCount(cat) }}
            </Badge>
          </Button>
        </div>

        <!-- Commands List -->
        <div :class="compactView ? 'space-y-1' : 'space-y-2'" class="max-h-[400px] overflow-y-auto">
          <div
            v-for="cmd in filteredCommands"
            :key="cmd.command"
            :class="[
              'bg-muted/30 group hover:border-primary/50 rounded-lg border transition-all',
              compactView ? 'p-2' : 'p-3',
            ]"
          >
            <div :class="['flex items-start justify-between gap-2', compactView ? 'mb-1' : 'mb-2']">
              <div class="flex-1">
                <div :class="['flex items-center gap-2', compactView ? 'mb-0.5' : 'mb-1']">
                  <Badge :variant="getCategoryVariant(cmd.category)" class="text-[8px]">
                    {{ cmd.category }}
                  </Badge>
                  <h3
                    :class="
                      compactView ? 'text-[12px] font-semibold' : 'text-md font-semibold sm:text-sm'
                    "
                  >
                    {{ cmd.title }}
                  </h3>
                </div>
                <p v-if="!compactView" class="text-muted-foreground sm:text-md text-[12px]">
                  {{ cmd.description }}
                </p>
              </div>
              <Button
                @click="copyCommand(cmd.command)"
                size="sm"
                variant="ghost"
                class="h-7 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Icon
                  :icon="copiedCommand === cmd.command ? 'mdi:check' : 'mdi:content-copy'"
                  class="h-3 w-3"
                />
              </Button>
            </div>
            <div
              :class="[
                'bg-background relative rounded border font-mono',
                compactView ? 'p-1.5 text-[9px]' : 'sm:text-md p-2 text-[12px]',
              ]"
            >
              <code>{{ cmd.command }}</code>
            </div>
            <div v-if="cmd.example && !compactView" class="mt-2">
              <p class="text-muted-foreground mb-1 text-[9px] sm:text-[12px]">Example:</p>
              <div class="bg-muted rounded border p-2 font-mono text-[9px] sm:text-[12px]">
                <code class="whitespace-pre-wrap">{{ cmd.example }}</code>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-if="filteredCommands.length === 0"
          class="flex flex-col items-center justify-center py-12"
        >
          <Icon icon="mdi:file-search" class="text-muted-foreground mb-2 h-12 w-12" />
          <p class="text-muted-foreground text-sm">No commands found</p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@iconify/vue'

const searchQuery = ref('')
const selectedCategory = ref('All')
const copiedCommand = ref('')
const compactView = ref(false)

interface GitCommand {
  title: string
  command: string
  description: string
  category: string
  example?: string
}

const commands: GitCommand[] = [
  {
    title: 'Initialize Repository',
    command: 'git init',
    description: 'Create a new Git repository in the current directory',
    category: 'Setup',
    example: 'git init',
  },
  {
    title: 'Clone Repository',
    command: 'git clone <url>',
    description: 'Clone a repository from a remote URL',
    category: 'Setup',
    example: 'git clone https://github.com/user/repo.git',
  },
  {
    title: 'Check Status',
    command: 'git status',
    description: 'Show the working tree status',
    category: 'Basic',
    example: 'git status',
  },
  {
    title: 'Stage Files',
    command: 'git add <file>',
    description: 'Add file contents to the staging area',
    category: 'Basic',
    example: 'git add . # Add all files\ngit add file.txt # Add specific file',
  },
  {
    title: 'Commit Changes',
    command: 'git commit -m "message"',
    description: 'Record changes to the repository',
    category: 'Basic',
    example: 'git commit -m "Add new feature"',
  },
  {
    title: 'Push Changes',
    command: 'git push origin <branch>',
    description: 'Update remote refs along with associated objects',
    category: 'Remote',
    example: 'git push origin main',
  },
  {
    title: 'Pull Changes',
    command: 'git pull',
    description: 'Fetch from and integrate with another repository',
    category: 'Remote',
    example: 'git pull origin main',
  },
  {
    title: 'Create Branch',
    command: 'git branch <name>',
    description: 'Create a new branch',
    category: 'Branching',
    example: 'git branch feature/new-feature',
  },
  {
    title: 'Switch Branch',
    command: 'git checkout <branch>',
    description: 'Switch to a different branch',
    category: 'Branching',
    example: 'git checkout main',
  },
  {
    title: 'Create & Switch Branch',
    command: 'git checkout -b <name>',
    description: 'Create a new branch and switch to it',
    category: 'Branching',
    example: 'git checkout -b feature/login',
  },
  {
    title: 'Merge Branch',
    command: 'git merge <branch>',
    description: 'Join two or more development histories together',
    category: 'Branching',
    example: 'git merge feature/new-feature',
  },
  {
    title: 'Delete Branch',
    command: 'git branch -d <name>',
    description: 'Delete a branch',
    category: 'Branching',
    example: 'git branch -d feature/old-feature',
  },
  {
    title: 'View Commit History',
    command: 'git log',
    description: 'Show commit logs',
    category: 'History',
    example: 'git log --oneline --graph',
  },
  {
    title: 'Show Changes',
    command: 'git diff',
    description: 'Show changes between commits, commit and working tree, etc',
    category: 'History',
    example: 'git diff HEAD~1',
  },
  {
    title: 'Stash Changes',
    command: 'git stash',
    description: 'Stash the changes in a dirty working directory away',
    category: 'Stashing',
    example: 'git stash save "WIP: feature"',
  },
  {
    title: 'Apply Stash',
    command: 'git stash pop',
    description: 'Remove a single stashed state and apply it',
    category: 'Stashing',
    example: 'git stash pop',
  },
  {
    title: 'List Stashes',
    command: 'git stash list',
    description: 'List the stash entries',
    category: 'Stashing',
    example: 'git stash list',
  },
  {
    title: 'Undo Commit',
    command: 'git reset --soft HEAD~1',
    description: 'Undo last commit but keep changes staged',
    category: 'Undo',
    example: 'git reset --soft HEAD~1',
  },
  {
    title: 'Discard Changes',
    command: 'git checkout -- <file>',
    description: 'Discard changes in working directory',
    category: 'Undo',
    example: 'git checkout -- file.txt',
  },
  {
    title: 'Amend Commit',
    command: 'git commit --amend',
    description: 'Replace the tip of the current branch by creating a new commit',
    category: 'Undo',
    example: 'git commit --amend -m "Updated message"',
  },
  {
    title: 'Add Remote',
    command: 'git remote add origin <url>',
    description: 'Add a remote repository',
    category: 'Remote',
    example: 'git remote add origin https://github.com/user/repo.git',
  },
  {
    title: 'View Remotes',
    command: 'git remote -v',
    description: 'List all remote repositories',
    category: 'Remote',
    example: 'git remote -v',
  },
  {
    title: 'Fetch Changes',
    command: 'git fetch',
    description: 'Download objects and refs from another repository',
    category: 'Remote',
    example: 'git fetch origin',
  },
  {
    title: 'Rebase',
    command: 'git rebase <branch>',
    description: 'Reapply commits on top of another base tip',
    category: 'Advanced',
    example: 'git rebase main',
  },
  {
    title: 'Cherry Pick',
    command: 'git cherry-pick <commit>',
    description: 'Apply the changes introduced by existing commits',
    category: 'Advanced',
    example: 'git cherry-pick abc1234',
  },
  {
    title: 'Tag Commit',
    command: 'git tag <name>',
    description: 'Create a tag for a specific commit',
    category: 'Advanced',
    example: 'git tag v1.0.0',
  },
]

const categories = computed(() => {
  const cats = ['All', ...new Set(commands.map((cmd) => cmd.category))]
  return cats
})

const filteredCommands = computed(() => {
  let filtered = commands

  if (selectedCategory.value !== 'All') {
    filtered = filtered.filter((cmd) => cmd.category === selectedCategory.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (cmd) =>
        cmd.title.toLowerCase().includes(query) ||
        cmd.command.toLowerCase().includes(query) ||
        cmd.description.toLowerCase().includes(query),
    )
  }

  return filtered
})

function getCategoryVariant(category: string): any {
  const variants: Record<string, string> = {
    Setup: 'default',
    Basic: 'secondary',
    Branching: 'outline',
    Remote: 'default',
    History: 'secondary',
    Stashing: 'outline',
    Undo: 'destructive',
    Advanced: 'default',
  }
  return variants[category] || 'default'
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    All: 'mdi:view-grid',
    Setup: 'mdi:cog',
    Basic: 'mdi:file-document',
    Branching: 'mdi:source-branch',
    Remote: 'mdi:cloud',
    History: 'mdi:history',
    Stashing: 'mdi:package-variant',
    Undo: 'mdi:undo',
    Advanced: 'mdi:rocket',
  }
  return icons[category] || 'mdi:code-tags'
}

function getCommandCount(category: string): number {
  if (category === 'All') return commands.length
  return commands.filter((cmd) => cmd.category === category).length
}

function copyCommand(command: string) {
  navigator.clipboard.writeText(command)
  copiedCommand.value = command
  setTimeout(() => {
    copiedCommand.value = ''
  }, 1500)
}
</script>
