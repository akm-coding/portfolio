type Block =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }

// Project descriptions are free text typed in the admin. Recognise the
// conventions used there: "Heading:" lines, "- item" bullets, and runs of
// lines after a heading (up to the next blank line) as list items.
function parse(description: string): Block[] {
  const lines = description.replace(/\r\n?/g, "\n").split("\n")
  const blocks: Block[] = []
  let inList = false

  const pushItem = (text: string) => {
    const last = blocks[blocks.length - 1]
    if (last?.type === "list") last.items.push(text)
    else blocks.push({ type: "list", items: [text] })
  }

  for (const raw of lines) {
    const line = raw.trim()

    if (!line) {
      // A blank line ends a list, but not the gap right after a heading.
      if (blocks[blocks.length - 1]?.type === "list") inList = false
      continue
    }

    if (line.endsWith(":") && line.length < 60) {
      blocks.push({ type: "heading", text: line.slice(0, -1) })
      inList = true
      continue
    }

    const bullet = line.match(/^[-•*]\s+(.*)$/)
    if (bullet) {
      inList = true
      pushItem(bullet[1])
    } else if (inList) {
      pushItem(line)
    } else {
      blocks.push({ type: "paragraph", text: line })
    }
  }

  return blocks
}

// "Name — detail" or "Label: detail" -> bold lead-in
function ListItem({ text }: { text: string }) {
  const match = text.match(/^(.{2,40}?)(\s+—\s+|:\s+)(.+)$/)
  if (!match) return <li>{text}</li>
  return (
    <li>
      <span className="font-medium text-foreground">{match[1]}</span>
      {match[2].includes("—") ? " — " : ": "}
      {match[3]}
    </li>
  )
}

export function ProjectDescription({ text }: { text: string }) {
  const blocks = parse(text)

  return (
    <div className="space-y-4 leading-relaxed text-muted-foreground">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            return (
              <h3
                key={i}
                className="pt-4 text-base font-semibold text-foreground first:pt-0"
              >
                {block.text}
              </h3>
            )
          case "list":
            return (
              <ul
                key={i}
                className="list-disc space-y-2 pl-5 marker:text-muted-foreground/60"
              >
                {block.items.map((item, j) => (
                  <ListItem key={j} text={item} />
                ))}
              </ul>
            )
          default:
            return <p key={i}>{block.text}</p>
        }
      })}
    </div>
  )
}
