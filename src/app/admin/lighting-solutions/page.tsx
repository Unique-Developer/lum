"use client";

import { useEffect, useState } from "react";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { AdminShell } from "@/components/admin/AdminShell";

type Content = {
  pageTitle?: string;
  pageSubtitle?: string;
  customStudioTitle?: string;
  customStudioIntro?: string;
  whatWeDevelop?: string[];
  collaborationSteps?: Array<{ title: string; body: string }>;
};

export default function AdminLightingSolutionsPage() {
  const { token, getHeaders } = useAdminAuth();
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    fetch("/api/admin/lighting-solutions", { headers: getHeaders() })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setContent)
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
  }, [token, getHeaders]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content) return;
    setError("");
    setSaving(true);
    setSuccess(false);
    try {
      const res = await fetch("/api/admin/lighting-solutions", {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getHeaders() },
        body: JSON.stringify({
          pageTitle: content.pageTitle,
          pageSubtitle: content.pageSubtitle,
          customStudioTitle: content.customStudioTitle,
          customStudioIntro: content.customStudioIntro,
          whatWeDevelop: content.whatWeDevelop,
          collaborationSteps: content.collaborationSteps,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      const updated = await res.json();
      setContent(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (!token) return null;
  if (loading)
    return (
      <AdminShell title="Lighting Solutions" subtitle="Edit page content">
        <div className="flex h-48 items-center justify-center text-foreground/50">
          Loading…
        </div>
      </AdminShell>
    );
  if (!content) {
    return (
      <AdminShell title="Lighting Solutions">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error || "Failed to load content"}
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Lighting Solutions" subtitle="Edit text and content for the public Lighting Solutions page">
      <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-8">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-800">
            Saved successfully
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-foreground">Page title</label>
          <input
            type="text"
            value={content?.pageTitle ?? ""}
            onChange={(e) => setContent((c) => c && { ...c, pageTitle: e.target.value })}
            className="mt-1 w-full rounded-lg border border-foreground/20 bg-background px-4 py-2 text-foreground focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground">Page subtitle</label>
          <textarea
            rows={2}
            value={content?.pageSubtitle ?? ""}
            onChange={(e) => setContent((c) => c && { ...c, pageSubtitle: e.target.value })}
            className="mt-1 w-full resize-none rounded-lg border border-foreground/20 bg-background px-4 py-2 text-foreground focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
          />
        </div>

        <hr className="border-foreground/10" />

        <div>
          <label className="block text-sm font-medium text-foreground">Custom Studio section title</label>
          <input
            type="text"
            value={content?.customStudioTitle ?? ""}
            onChange={(e) => setContent((c) => c && { ...c, customStudioTitle: e.target.value })}
            className="mt-1 w-full rounded-lg border border-foreground/20 bg-background px-4 py-2 text-foreground focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground">Custom Studio intro</label>
          <textarea
            rows={4}
            value={content?.customStudioIntro ?? ""}
            onChange={(e) => setContent((c) => c && { ...c, customStudioIntro: e.target.value })}
            className="mt-1 w-full resize-none rounded-lg border border-foreground/20 bg-background px-4 py-2 text-foreground focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground">
            What We Develop (one item per line)
          </label>
          <textarea
            rows={6}
            value={(content?.whatWeDevelop ?? []).join("\n")}
            onChange={(e) =>
              setContent((c) => c && {
                ...c,
                whatWeDevelop: e.target.value.split("\n").filter(Boolean),
              })
            }
            className="mt-1 w-full resize-none rounded-lg border border-foreground/20 bg-background px-4 py-2 font-mono text-sm text-foreground focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
            placeholder="Sculptural chandeliers&#10;Fabric lighting structures&#10;..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground">Collaboration steps</label>
          <p className="mt-1 text-xs text-foreground/60">
            One step per block. Format: Title | Body (separate with |)
          </p>
          <div className="mt-2 space-y-3">
            {(content?.collaborationSteps ?? []).map((step, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={step.title}
                  onChange={(e) =>
                    setContent((c) => {
                      if (!c?.collaborationSteps) return c;
                      const steps = [...c.collaborationSteps];
                      steps[i] = { ...steps[i], title: e.target.value };
                      return { ...c, collaborationSteps: steps };
                    })
                  }
                  placeholder="e.g. 1. Concept & brief"
                  className="flex-1 rounded-lg border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
                />
                <input
                  type="text"
                  value={step.body}
                  onChange={(e) =>
                    setContent((c) => {
                      if (!c?.collaborationSteps) return c;
                      const steps = [...c.collaborationSteps];
                      steps[i] = { ...steps[i], body: e.target.value };
                      return { ...c, collaborationSteps: steps };
                    })
                  }
                  placeholder="Description..."
                  className="flex-[2] rounded-lg border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-primary-main px-6 py-2.5 font-medium text-white hover:bg-primary-main/90 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
          <a
            href="/lighting-solutions"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-foreground/20 px-6 py-2.5 font-medium text-foreground hover:bg-foreground/5"
          >
            Preview page
          </a>
        </div>
      </form>
    </AdminShell>
  );
}
