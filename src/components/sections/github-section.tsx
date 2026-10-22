import { getGitHubData } from '@/lib/queries/github'
import { RepoCard } from '@/components/github/repo-card'
import { GitHubStatsRow } from '@/components/github/github-stats-row'
import { ContributionHeatmap } from '@/components/github/contribution-heatmap'
import { Section } from '@/components/layout/section'

export async function GitHubSection() {
  const data = await getGitHubData()

  if (!data) {
    return null
  }

  return (
    <Section
      id="github"
      eyebrow="Open source"
      title="GitHub activity"
      description="Pinned repositories and a year of contributions."
    >
      {data.pinnedRepos.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.pinnedRepos.map((repo) => (
            <RepoCard key={repo.nameWithOwner} repo={repo} />
          ))}
        </div>
      )}

      <GitHubStatsRow
        totalContributions={data.totalContributions}
        totalRepos={data.totalRepos}
        totalStars={data.totalStars}
      />

      <div className="rounded-xl border p-4">
        <ContributionHeatmap activities={data.contributionDays} />
      </div>
    </Section>
  )
}
