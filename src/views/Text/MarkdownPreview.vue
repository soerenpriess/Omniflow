<template>
  <div class="flex w-full flex-col items-center gap-4 p-4 sm:gap-0">
    <p class="text-muted-foreground mb-2 w-full max-w-6xl text-center text-sm">
      Write and preview Markdown in real-time
    </p>
    <Card class="route-transition-animation w-full rounded-2xl shadow-lg">
      <CardHeader class="space-y-1">
        <CardTitle class="flex items-center gap-2 text-2xl font-semibold">
          <Icon icon="mdi:language-markdown" class="text-primary h-5 w-5 sm:h-6 sm:w-6" />
          Markdown Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4 lg:grid-cols-2">
          <!-- Editor -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <Label>Markdown Editor</Label>
              <Button size="sm" variant="outline" @click="copyMarkdown">
                <Icon
                  :icon="copiedMarkdown ? 'mdi:check' : 'mdi:content-copy'"
                  class="mr-1 h-3 w-3"
                />
                {{ copiedMarkdown ? 'Copied!' : 'Copy' }}
              </Button>
            </div>
            <ScrollArea class="h-[500px] rounded-lg border">
              <Textarea
                v-model="markdown"
                rows="20"
                placeholder="# Hello Markdown!

Write your **markdown** here..."
                class="resize-none border-0 font-mono text-sm focus-visible:ring-0"
              />
            </ScrollArea>
          </div>

          <!-- Preview -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <Label>Preview</Label>
              <Button size="sm" variant="outline" @click="copyHtml">
                <Icon :icon="copiedHtml ? 'mdi:check' : 'mdi:content-copy'" class="mr-1 h-3 w-3" />
                {{ copiedHtml ? 'Copied!' : 'Copy HTML' }}
              </Button>
            </div>
            <ScrollArea class="h-[500px] rounded-lg border p-4">
              <div v-html="renderedHtml" class="prose prose-sm dark:prose-invert max-w-none" />
            </ScrollArea>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="mt-4 flex flex-wrap gap-2">
          <Button @click="insertSyntax('**', '**')" size="sm" variant="outline">
            <Icon icon="mdi:format-bold" class="mr-1 h-4 w-4" />
            Bold
          </Button>
          <Button @click="insertSyntax('*', '*')" size="sm" variant="outline">
            <Icon icon="mdi:format-italic" class="mr-1 h-4 w-4" />
            Italic
          </Button>
          <Button @click="insertSyntax('`', '`')" size="sm" variant="outline">
            <Icon icon="mdi:code-tags" class="mr-1 h-4 w-4" />
            Inline Code
          </Button>
          <Button @click="insertCodeBlock()" size="sm" variant="outline">
            <Icon icon="mdi:code-braces" class="mr-1 h-4 w-4" />
            Code Block
          </Button>
          <Button @click="insertSyntax('[', '](url)')" size="sm" variant="outline">
            <Icon icon="mdi:link" class="mr-1 h-4 w-4" />
            Link
          </Button>
          <Button @click="insertLine('# ')" size="sm" variant="outline">
            <Icon icon="mdi:format-header-1" class="mr-1 h-4 w-4" />
            H1
          </Button>
          <Button @click="insertLine('## ')" size="sm" variant="outline">
            <Icon icon="mdi:format-header-2" class="mr-1 h-4 w-4" />
            H2
          </Button>
          <Button @click="insertLine('### ')" size="sm" variant="outline">
            <Icon icon="mdi:format-header-3" class="mr-1 h-4 w-4" />
            H3
          </Button>
          <Button @click="insertLine('- ')" size="sm" variant="outline">
            <Icon icon="mdi:format-list-bulleted" class="mr-1 h-4 w-4" />
            List
          </Button>
          <Button @click="insertLine('> ')" size="sm" variant="outline">
            <Icon icon="mdi:format-quote-close" class="mr-1 h-4 w-4" />
            Quote
          </Button>
          <Button @click="insertLine('---')" size="sm" variant="outline">
            <Icon icon="mdi:minus" class="mr-1 h-4 w-4" />
            Divider
          </Button>
          <Button @click="clearAll" size="sm" variant="outline">
            <Icon icon="mdi:delete" class="mr-1 h-4 w-4" />
            Clear
          </Button>
        </div>

        <!-- Cheat Sheet -->
        <Collapsible class="mt-4">
          <CollapsibleTrigger as-child>
            <Button variant="ghost" class="w-full justify-between">
              <span class="flex items-center gap-2">
                <Icon icon="mdi:help-circle" class="h-5 w-5" />
                Markdown Cheat Sheet
              </span>
              <Icon icon="mdi:chevron-down" class="h-5 w-5" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent class="mt-2 rounded-lg border p-4">
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <h4 class="mb-2 font-semibold">Headers</h4>
                <pre class="text-xs">
# H1
## H2
### H3</pre
                >
              </div>
              <div>
                <h4 class="mb-2 font-semibold">Emphasis</h4>
                <pre class="text-xs">
**bold**
*italic*
~~strikethrough~~</pre
                >
              </div>
              <div>
                <h4 class="mb-2 font-semibold">Lists</h4>
                <pre class="text-xs">
- Item 1
- Item 2
  - Nested
1. Ordered
2. List</pre
                >
              </div>
              <div>
                <h4 class="mb-2 font-semibold">Links & Images</h4>
                <pre class="text-xs">
[Link](url)
![Image](url)</pre
                >
              </div>
              <div>
                <h4 class="mb-2 font-semibold">Code</h4>
                <pre class="text-xs">
`inline code`
```javascript
code block
```</pre
                >
              </div>
              <div>
                <h4 class="mb-2 font-semibold">Other</h4>
                <pre class="text-xs">
> Quote
---
Horizontal rule</pre
                >
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Icon } from '@iconify/vue'

const copiedMarkdown = ref(false)
const copiedHtml = ref(false)
const markdown = ref(`# Welcome to Markdown Preview

## Features
- **Bold** and *italic* text
- [Links](https://example.com)
- Code blocks
- And much more!

\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

> This is a blockquote

### Lists
1. First item
2. Second item
3. Third item

---

Happy writing! 🎉
`)

const renderedHtml = computed(() => {
  return parseMarkdown(markdown.value)
})

function parseMarkdown(text: string): string {
  let html = text

  // Code blocks (must be processed before inline code)
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre><code class="language-${lang || 'text'}">${escapeHtml(code.trim())}</code></pre>`
  })

  // Inline code (must be after code blocks to avoid conflicts)
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')

  // Headers (must be before line breaks)
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')

  // Strikethrough
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>')

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener">$1</a>',
  )

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')

  // Blockquotes
  html = html.replace(/^&gt; (.*$)/gim, '<blockquote>$1</blockquote>')
  html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')

  // Horizontal rules (must be before line breaks)
  html = html.replace(/^---$/gim, '<hr />')
  html = html.replace(/^- - -$/gim, '<hr />')
  html = html.replace(/^\*\*\*$/gim, '<hr />')

  // Unordered lists
  html = html.replace(/^[\*\-] (.+)$/gim, '<li>$1</li>')
  html = html.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>')

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gim, '<li>$1</li>')

  // Line breaks
  html = html.replace(/\n/g, '<br />')

  return html
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

function insertSyntax(before: string, after: string) {
  const textarea = document.querySelector('textarea')
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = markdown.value.substring(start, end) || 'text'

  markdown.value =
    markdown.value.substring(0, start) +
    before +
    selectedText +
    after +
    markdown.value.substring(end)

  // Set cursor position
  setTimeout(() => {
    textarea.focus()
    textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
  }, 0)
}

function insertLine(prefix: string) {
  const textarea = document.querySelector('textarea')
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd

  // For divider, insert on its own line
  if (prefix === '---') {
    const lineStart = markdown.value.lastIndexOf('\n', start - 1) + 1
    const lineEnd = markdown.value.indexOf('\n', start)
    const endPos = lineEnd === -1 ? markdown.value.length : lineEnd

    const newText = '\n---\n'
    markdown.value =
      markdown.value.substring(0, endPos) + newText + markdown.value.substring(endPos)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(endPos + newText.length, endPos + newText.length)
    }, 0)
    return
  }

  const lineStart = markdown.value.lastIndexOf('\n', start - 1) + 1
  markdown.value =
    markdown.value.substring(0, lineStart) + prefix + markdown.value.substring(lineStart)

  setTimeout(() => {
    textarea.focus()
    textarea.setSelectionRange(start + prefix.length, start + prefix.length)
  }, 0)
}

function insertCodeBlock() {
  const textarea = document.querySelector('textarea')
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = markdown.value.substring(start, end) || 'code'
  const codeBlock = `\n\`\`\`javascript\n${selectedText}\n\`\`\`\n`

  markdown.value = markdown.value.substring(0, start) + codeBlock + markdown.value.substring(end)

  setTimeout(() => {
    textarea.focus()
    const newPos = start + codeBlock.length - 4
    textarea.setSelectionRange(newPos, newPos)
  }, 0)
}

function copyMarkdown() {
  navigator.clipboard.writeText(markdown.value)
  copiedMarkdown.value = true
  setTimeout(() => {
    copiedMarkdown.value = false
  }, 1500)
}

function copyHtml() {
  navigator.clipboard.writeText(renderedHtml.value)
  copiedHtml.value = true
  setTimeout(() => {
    copiedHtml.value = false
  }, 1500)
}

function clearAll() {
  markdown.value = ''
}
</script>

<style scoped>
.prose h1 {
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 1rem;
  margin-top: 1.5rem;
}

.prose h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  margin-top: 1.25rem;
}

.prose h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  margin-top: 1rem;
}

.prose p {
  margin-bottom: 1rem;
}

.prose code {
  background-color: hsl(var(--muted));
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-family: monospace;
}

.prose pre {
  background-color: hsl(var(--muted));
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.prose pre code {
  background-color: transparent;
  padding: 0;
}

.prose a {
  color: hsl(var(--primary));
  text-decoration: underline;
}

.prose a:hover {
  text-decoration: none;
}

.prose blockquote {
  border-left: 4px solid hsl(var(--primary));
  padding-left: 1rem;
  font-style: italic;
  margin: 1rem 0;
}

.prose ul,
.prose ol {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.prose li {
  margin-bottom: 0.25rem;
}

.prose hr {
  margin: 1.5rem 0;
  border-color: hsl(var(--border));
}

.prose img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1rem 0;
}
</style>
