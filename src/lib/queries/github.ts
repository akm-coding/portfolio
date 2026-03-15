import type { GitHubData } from '@/lib/types/database'

const GITHUB_GRAPHQL_QUERY = `
query($username: String!) {
  user(login: $username) {
    pinnedItems(first: 6, types: REPOSITORY) {
      nodes {
        ... on Repository {
          name
          nameWithOwner
          description
          url
          stargazerCount
          forkCount
          primaryLanguage {
            name
            color
          }
        }
      }
    }
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            date
          }
        }
      }
    }
    repositories(ownerAffiliations: OWNER, isFork: false, first: 100, orderBy: {field: STARGAZERS, direction: DESC}) {
      totalCount
      nodes {
        stargazerCount
      }
    }
  }
}
`

function transformContributions(
  weeks: Array<{ contributionDays: Array<{ contributionCount: number; date: string }> }>
): Array<{ date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }> {
  const allDays = weeks.flatMap((week) => week.contributionDays)
  const maxCount = Math.max(...allDays.map((d) => d.contributionCount), 1)

  return allDays.map((day) => ({
    date: day.date,
    count: day.contributionCount,
    level:
      day.contributionCount === 0
        ? (0 as const)
        : (Math.min(Math.ceil((day.contributionCount / maxCount) * 4), 4) as 0 | 1 | 2 | 3 | 4),
  }))
}

export async function getGitHubData(): Promise<GitHubData | null> {
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    return null
  }

  const username = process.env.GITHUB_USERNAME ?? 'akm-coding'

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: GITHUB_GRAPHQL_QUERY, variables: { username } }),
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      console.error(`GitHub API error: ${response.status} ${response.statusText}`)
      return null
    }

    const json = await response.json()

    if (json.errors) {
      console.error('GitHub GraphQL errors:', json.errors)
      return null
    }

    const user = json.data.user
    const calendar = user.contributionsCollection.contributionCalendar
    const repos = user.repositories

    return {
      pinnedRepos: user.pinnedItems.nodes,
      totalContributions: calendar.totalContributions,
      totalRepos: repos.totalCount,
      totalStars: repos.nodes.reduce(
        (sum: number, repo: { stargazerCount: number }) => sum + repo.stargazerCount,
        0
      ),
      contributionDays: transformContributions(calendar.weeks),
    }
  } catch (error) {
    console.error('Failed to fetch GitHub data:', error)
    return null
  }
}
