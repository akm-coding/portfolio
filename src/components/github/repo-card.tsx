import type { PinnedRepo } from '@/lib/types/database'
import { ExternalLink, Star, GitFork } from 'lucide-react'

export function RepoCard({ repo }: { repo: PinnedRepo }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-primary truncate">
          {repo.nameWithOwner}
        </h3>
        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground shrink-0"
          aria-label={`Open ${repo.name} on GitHub`}
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      {repo.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
          {repo.description}
        </p>
      )}

      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
        {repo.primaryLanguage && (
          <span className="flex items-center gap-1">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: repo.primaryLanguage.color }}
            />
            {repo.primaryLanguage.name}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Star className="h-3 w-3" />
          {repo.stargazerCount}
        </span>
        <span className="flex items-center gap-1">
          <GitFork className="h-3 w-3" />
          {repo.forkCount}
        </span>
      </div>
    </div>
  )
}
