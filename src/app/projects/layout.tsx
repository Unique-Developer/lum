import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Lumin Art",
  description:
    "Selected installations across residential, commercial, and hospitality spaces. Lumin Art project showcase.",
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
