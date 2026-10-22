"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function SkillChips({ skills }: { skills: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <li
          key={skill}
          className="rounded-lg border bg-card px-3 py-1.5 text-sm font-medium transition-colors hover:border-foreground/30"
        >
          {skill}
        </li>
      ))}
    </ul>
  )
}

export function SkillsTabs({ groups }: { groups: Record<string, string[]> }) {
  const categories = Object.keys(groups)
  const all = Array.from(new Set(Object.values(groups).flat()))

  return (
    <Tabs defaultValue="All" className="gap-6">
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <TabsList variant="line" className="h-9">
          {["All", ...categories].map((category) => (
            <TabsTrigger key={category} value={category} className="px-3">
              {category}
              <span className="font-mono text-xs text-muted-foreground">
                {category === "All" ? all.length : groups[category].length}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent value="All">
        <SkillChips skills={all} />
      </TabsContent>
      {categories.map((category) => (
        <TabsContent key={category} value={category}>
          <SkillChips skills={groups[category]} />
        </TabsContent>
      ))}
    </Tabs>
  )
}
