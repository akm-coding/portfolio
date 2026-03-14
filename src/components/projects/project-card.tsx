import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Github, Smartphone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { Project } from "@/lib/types/database";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <Card className="h-full pt-0 transition-all duration-300 group-hover:shadow-lg group-hover:scale-[1.02]">
        <div className="relative aspect-video overflow-hidden rounded-t-lg">
          {project.thumbnail_url ? (
            <Image
              src={project.thumbnail_url}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary/20 to-primary/5" />
          )}
        </div>

        <CardHeader>
          <CardTitle className="line-clamp-1">
            <h3>{project.title}</h3>
          </CardTitle>
          {project.short_description && (
            <CardDescription className="line-clamp-2">
              {project.short_description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-1">
            {project.tech_stack.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>

        {(project.github_url ||
          project.live_url ||
          project.playstore_url ||
          project.appstore_url) && (
          <CardFooter className="gap-3">
            {project.github_url && (
              <span
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(project.github_url!, "_blank");
                }}
              >
                <Github className="size-3.5" />
                Code
              </span>
            )}
            {project.live_url && (
              <span
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(project.live_url!, "_blank");
                }}
              >
                <ExternalLink className="size-3.5" />
                Demo
              </span>
            )}
            {project.appstore_url && (
              <span
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(project.appstore_url!, "_blank");
                }}
              >
                <Smartphone className="size-3.5" />
                App Store
              </span>
            )}
            {project.playstore_url && (
              <span
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(project.playstore_url!, "_blank");
                }}
              >
                <Smartphone className="size-3.5" />
                Play Store
              </span>
            )}
          </CardFooter>
        )}
      </Card>
    </Link>
  );
}
