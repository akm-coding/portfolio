export function formatMonthYear(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  })
}

export function formatYear(dateString: string): string {
  return new Date(dateString).getFullYear().toString()
}

export function formatDuration(start: string, end: string | null): string {
  const startDate = new Date(start)
  const endDate = end ? new Date(end) : new Date()
  const months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth()) +
    1
  const years = Math.floor(months / 12)
  const rest = months % 12
  return [years && `${years} yr${years > 1 ? "s" : ""}`, rest && `${rest} mo`]
    .filter(Boolean)
    .join(" ")
}

// Descriptions are stored as free text; treat each non-empty line as a bullet,
// stripping any leading "-", "•" or "*" the author typed.
export function toBullets(description: string): string[] {
  return description
    .split("\n")
    .map((line) => line.replace(/^\s*[-•*]\s*/, "").trim())
    .filter(Boolean)
}

// "https://www.linkedin.com/in/foo/" -> "linkedin.com/in/foo"
export function prettyUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")
}
