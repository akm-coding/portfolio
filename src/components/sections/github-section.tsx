import { getGitHubData } from '@/lib/queries/github'
import { RepoCard } from '@/components/github/repo-card'
import { GitHubStatsRow } from '@/components/github/github-stats-row'
import { ContributionHeatmap } from '@/components/github/contribution-heatmap'
import { ScrollReveal } from '@/components/motion/scroll-reveal'

export async function GitHubSection() {
  const data = await getGitHubData()

  if (!data) {
    return null
  }

  return (
    <section className="py-16 px-4">
      <ScrollReveal>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight mb-8">
            My GitHub Activity
          </h2>

          {data.pinnedRepos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

          <ContributionHeatmap activities={data.contributionDays} />
        </div>
      </ScrollReveal>
    </section>
  )
}
