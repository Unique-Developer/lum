"use client";

import { useEffect, useState } from "react";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { AdminShell } from "@/components/admin/AdminShell";
import { FileUpload } from "@/components/admin/FileUpload";
import type { HomepageContent, HomepageImageItem } from "@/lib/homepage";

const inputClass =
  "mt-1 w-full rounded-lg border border-foreground/20 bg-background px-4 py-2 text-foreground focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main";
const labelClass = "block text-sm font-medium text-foreground";

function ImageRow({
  img,
  onChange,
  onRemove,
  showLabel,
  showLinkUrl,
  showUpload,
  getHeaders,
}: {
  img: HomepageImageItem;
  onChange: (img: HomepageImageItem) => void;
  onRemove?: () => void;
  showLabel?: boolean;
  showLinkUrl?: boolean;
  showUpload?: boolean;
  getHeaders?: () => HeadersInit;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-foreground/10 bg-foreground/[0.02] p-3 sm:flex-row sm:items-end">
      <div className="flex-1 space-y-2">
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="Image URL"
            value={img.src}
            onChange={(e) => onChange({ ...img, src: e.target.value })}
            className={`${inputClass} text-sm flex-1`}
          />
          {showUpload && getHeaders && (
            <FileUpload
              accept="image"
              prefix="homepage/product-highlights"
              onUpload={(url) => onChange({ ...img, src: url })}
              getHeaders={getHeaders}
              buttonLabel="Upload"
              className="shrink-0"
            />
          )}
        </div>
        <input
          type="text"
          placeholder="Alt text"
          value={img.alt}
          onChange={(e) => onChange({ ...img, alt: e.target.value })}
          className={`${inputClass} text-sm`}
        />
        {showLabel && (
          <input
            type="text"
            placeholder="Label (optional)"
            value={img.label ?? ""}
            onChange={(e) => onChange({ ...img, label: e.target.value || undefined })}
            className={`${inputClass} text-sm`}
          />
        )}
        {showLinkUrl && (
          <input
            type="url"
            placeholder="Link URL (optional) — page to open when image is clicked"
            value={img.href ?? ""}
            onChange={(e) => onChange({ ...img, href: e.target.value || undefined })}
            className={`${inputClass} text-sm`}
          />
        )}
      </div>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 rounded border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
        >
          Remove
        </button>
      )}
    </div>
  );
}

export default function AdminHomepagePage() {
  const { token, getHeaders } = useAdminAuth();
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    fetch("/api/admin/homepage", { headers: getHeaders() })
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
      const res = await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getHeaders() },
        body: JSON.stringify(content),
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

  function updateImageArray(
    path: "featuredInstallations" | "productHighlights" | "architecturalScenes",
    fn: (images: HomepageImageItem[]) => HomepageImageItem[]
  ) {
    setContent((c) => {
      if (!c) return c;
      const section = { ...c.visualProof[path], images: fn(c.visualProof[path].images) };
      return {
        ...c,
        visualProof: { ...c.visualProof, [path]: section },
      };
    });
  }

  if (!token) return null;
  if (loading)
    return (
      <AdminShell title="Homepage" subtitle="Edit homepage content and images">
        <div className="flex h-48 items-center justify-center text-foreground/50">Loading…</div>
      </AdminShell>
    );
  if (!content)
    return (
      <AdminShell title="Homepage">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error || "Failed to load content"}
        </div>
      </AdminShell>
    );

  return (
    <AdminShell
      title="Homepage"
      subtitle="Edit hero, visual proof images, legacy, dual brand, pillars, and CTA. Use full image URLs (e.g. from Storage uploads)."
    >
      <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-10">
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

        {/* Hero */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Hero Section</h2>
          <div>
            <label className={labelClass}>Headline</label>
            <input
              type="text"
              value={content.hero.headline}
              onChange={(e) =>
                setContent((c) => c && { ...c, hero: { ...c.hero, headline: e.target.value } })
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Subtext</label>
            <textarea
              rows={2}
              value={content.hero.subtext}
              onChange={(e) =>
                setContent((c) => c && { ...c, hero: { ...c.hero, subtext: e.target.value } })
              }
              className={`${inputClass} resize-none`}
            />
          </div>
          <div>
            <label className={labelClass}>Hero Image URL</label>
            <div className="mt-1 flex gap-2">
              <input
                type="url"
                value={content.hero.heroImage}
                onChange={(e) =>
                  setContent((c) => c && { ...c, hero: { ...c.hero, heroImage: e.target.value } })
                }
                className={inputClass}
              />
              <FileUpload
                accept="image"
                prefix="homepage"
                onUpload={(url) =>
                  setContent((c) => c && { ...c, hero: { ...c.hero, heroImage: url } })
                }
                getHeaders={getHeaders}
                buttonLabel="Upload"
                className="shrink-0"
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Hero Image Alt Text</label>
            <input
              type="text"
              value={content.hero.heroImageAlt}
              onChange={(e) =>
                setContent((c) => c && { ...c, hero: { ...c.hero, heroImageAlt: e.target.value } })
              }
              className={inputClass}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>CTA: Explore Lighting Solutions</label>
              <input
                type="text"
                value={content.hero.ctaExploreProjects}
                onChange={(e) =>
                  setContent((c) => c && { ...c, hero: { ...c.hero, ctaExploreProjects: e.target.value } })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>CTA: Start Project</label>
              <input
                type="text"
                value={content.hero.ctaStartProject}
                onChange={(e) =>
                  setContent((c) => c && { ...c, hero: { ...c.hero, ctaStartProject: e.target.value } })
                }
                className={inputClass}
              />
            </div>
          </div>
        </section>

        <hr className="border-foreground/10" />

        {/* Visual Proof */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Visual Proof Section</h2>
          <div>
            <label className={labelClass}>Eyebrow</label>
            <input
              type="text"
              value={content.visualProof.eyebrow}
              onChange={(e) =>
                setContent((c) => ({
                  ...c!,
                  visualProof: { ...c!.visualProof, eyebrow: e.target.value },
                }))
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Title</label>
            <input
              type="text"
              value={content.visualProof.title}
              onChange={(e) =>
                setContent((c) => ({
                  ...c!,
                  visualProof: { ...c!.visualProof, title: e.target.value },
                }))
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              rows={3}
              value={content.visualProof.description}
              onChange={(e) =>
                setContent((c) => ({
                  ...c!,
                  visualProof: { ...c!.visualProof, description: e.target.value },
                }))
              }
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="rounded-lg border border-foreground/10 bg-foreground/[0.02] p-4">
            <p className="text-sm font-medium text-foreground">Project & Product Showcase</p>
            <p className="mt-1 text-sm text-foreground/70">
              This section is now automatic. Featured installations are pulled from Projects, and
              Product highlights are pulled from Catalogues.
            </p>
            <p className="mt-2 text-xs text-foreground/60">
              Source items are populated dynamically from your live project and catalogue data.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Architectural Scenes — Title</label>
              <input
                type="text"
                value={content.visualProof.architecturalScenes.title}
                onChange={(e) =>
                  setContent((c) => ({
                    ...c!,
                    visualProof: {
                      ...c!.visualProof,
                      architecturalScenes: {
                        ...c!.visualProof.architecturalScenes,
                        title: e.target.value,
                      },
                    },
                  }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Architectural Scenes — Description</label>
              <input
                type="text"
                value={content.visualProof.architecturalScenes.description}
                onChange={(e) =>
                  setContent((c) => ({
                    ...c!,
                    visualProof: {
                      ...c!.visualProof,
                      architecturalScenes: {
                        ...c!.visualProof.architecturalScenes,
                        description: e.target.value,
                      },
                    },
                  }))
                }
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Architectural Scenes — Images</label>
            <div className="mt-2 space-y-3">
              {content.visualProof.architecturalScenes.images.map((img, i) => (
                <ImageRow
                  key={i}
                  img={img}
                  onChange={(updated) =>
                    updateImageArray("architecturalScenes", (imgs) => {
                      const next = [...imgs];
                      next[i] = updated;
                      return next;
                    })
                  }
                  onRemove={() =>
                    updateImageArray("architecturalScenes", (imgs) =>
                      imgs.filter((_, idx) => idx !== i)
                    )
                  }
                />
              ))}
              <button
                type="button"
                onClick={() =>
                  updateImageArray("architecturalScenes", (imgs) => [
                    ...imgs,
                    { src: "", alt: "" },
                  ])
                }
                className="rounded border border-foreground/20 px-3 py-1.5 text-sm text-foreground/70 hover:bg-foreground/5"
              >
                + Add image
              </button>
            </div>
          </div>
        </section>

        <hr className="border-foreground/10" />

        {/* Light House Legacy */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Light House Legacy</h2>
          <div>
            <label className={labelClass}>Title</label>
            <input
              type="text"
              value={content.lightHouseLegacy.title}
              onChange={(e) =>
                setContent((c) => ({
                  ...c!,
                  lightHouseLegacy: { ...c!.lightHouseLegacy, title: e.target.value },
                }))
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Subtitle (use newline for line break)</label>
            <textarea
              rows={2}
              value={content.lightHouseLegacy.subtitle}
              onChange={(e) =>
                setContent((c) => ({
                  ...c!,
                  lightHouseLegacy: { ...c!.lightHouseLegacy, subtitle: e.target.value },
                }))
              }
              className={`${inputClass} resize-none`}
            />
          </div>
          <div>
            <label className={labelClass}>Milestones</label>
            <div className="mt-2 space-y-2">
              {content.lightHouseLegacy.milestones.map((m, i) => (
                <div
                  key={i}
                  className="grid gap-2 rounded border border-foreground/10 bg-foreground/[0.02] p-3 sm:grid-cols-3"
                >
                  <input
                    type="text"
                    placeholder="Year"
                    value={m.year}
                    onChange={(e) =>
                      setContent((c) => {
                        if (!c) return c;
                        const ms = [...c.lightHouseLegacy.milestones];
                        ms[i] = { ...ms[i], year: e.target.value };
                        return { ...c, lightHouseLegacy: { ...c.lightHouseLegacy, milestones: ms } };
                      })
                    }
                    className={inputClass}
                  />
                  <input
                    type="text"
                    placeholder="Title"
                    value={m.title}
                    onChange={(e) =>
                      setContent((c) => {
                        if (!c) return c;
                        const ms = [...c.lightHouseLegacy.milestones];
                        ms[i] = { ...ms[i], title: e.target.value };
                        return { ...c, lightHouseLegacy: { ...c.lightHouseLegacy, milestones: ms } };
                      })
                    }
                    className={inputClass}
                  />
                  <input
                    type="text"
                    placeholder="Text"
                    value={m.text}
                    onChange={(e) =>
                      setContent((c) => {
                        if (!c) return c;
                        const ms = [...c.lightHouseLegacy.milestones];
                        ms[i] = { ...ms[i], text: e.target.value };
                        return { ...c, lightHouseLegacy: { ...c.lightHouseLegacy, milestones: ms } };
                      })
                    }
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="border-foreground/10" />

        {/* Dual Brand */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Dual Brand Section</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 rounded border border-foreground/10 p-4">
              <p className="text-sm font-medium text-foreground">Light House</p>
              <input
                type="text"
                placeholder="Name"
                value={content.dualBrand.lightHouse.name}
                onChange={(e) =>
                  setContent((c) => ({
                    ...c!,
                    dualBrand: {
                      ...c!.dualBrand,
                      lightHouse: { ...c!.dualBrand.lightHouse, name: e.target.value },
                    },
                  }))
                }
                className={inputClass}
              />
              <input
                type="text"
                placeholder="Tagline"
                value={content.dualBrand.lightHouse.tagline}
                onChange={(e) =>
                  setContent((c) => ({
                    ...c!,
                    dualBrand: {
                      ...c!.dualBrand,
                      lightHouse: { ...c!.dualBrand.lightHouse, tagline: e.target.value },
                    },
                  }))
                }
                className={inputClass}
              />
              <input
                type="url"
                placeholder="URL"
                value={content.dualBrand.lightHouse.url}
                onChange={(e) =>
                  setContent((c) => ({
                    ...c!,
                    dualBrand: {
                      ...c!.dualBrand,
                      lightHouse: { ...c!.dualBrand.lightHouse, url: e.target.value },
                    },
                  }))
                }
                className={inputClass}
              />
            </div>
            <div className="space-y-2 rounded border border-foreground/10 p-4">
              <p className="text-sm font-medium text-foreground">Fancy Light Store</p>
              <input
                type="text"
                placeholder="Name"
                value={content.dualBrand.fancyLight.name}
                onChange={(e) =>
                  setContent((c) => ({
                    ...c!,
                    dualBrand: {
                      ...c!.dualBrand,
                      fancyLight: { ...c!.dualBrand.fancyLight, name: e.target.value },
                    },
                  }))
                }
                className={inputClass}
              />
              <input
                type="text"
                placeholder="Tagline"
                value={content.dualBrand.fancyLight.tagline}
                onChange={(e) =>
                  setContent((c) => ({
                    ...c!,
                    dualBrand: {
                      ...c!.dualBrand,
                      fancyLight: { ...c!.dualBrand.fancyLight, tagline: e.target.value },
                    },
                  }))
                }
                className={inputClass}
              />
              <input
                type="url"
                placeholder="URL"
                value={content.dualBrand.fancyLight.url}
                onChange={(e) =>
                  setContent((c) => ({
                    ...c!,
                    dualBrand: {
                      ...c!.dualBrand,
                      fancyLight: { ...c!.dualBrand.fancyLight, url: e.target.value },
                    },
                  }))
                }
                className={inputClass}
              />
            </div>
          </div>
        </section>

        <hr className="border-foreground/10" />

        {/* What Is Lumin Art */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">What Is Lumin Art</h2>
          <div>
            <label className={labelClass}>Brand name</label>
            <input
              type="text"
              value={content.whatIsLuminArt.brandName}
              onChange={(e) =>
                setContent((c) => ({
                  ...c!,
                  whatIsLuminArt: { ...c!.whatIsLuminArt, brandName: e.target.value },
                }))
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Tagline</label>
            <input
              type="text"
              value={content.whatIsLuminArt.tagline}
              onChange={(e) =>
                setContent((c) => ({
                  ...c!,
                  whatIsLuminArt: { ...c!.whatIsLuminArt, tagline: e.target.value },
                }))
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Pillars (4 cards)</label>
            {content.whatIsLuminArt.pillars.map((p, i) => (
              <div key={i} className="mt-2 flex gap-2">
                <input
                  type="text"
                  placeholder="Title"
                  value={p.title}
                  onChange={(e) =>
                    setContent((c) => {
                      if (!c) return c;
                      const pillars = [...c.whatIsLuminArt.pillars];
                      pillars[i] = { ...pillars[i], title: e.target.value };
                      return {
                        ...c,
                        whatIsLuminArt: { ...c.whatIsLuminArt, pillars },
                      };
                    })
                  }
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={p.description}
                  onChange={(e) =>
                    setContent((c) => {
                      if (!c) return c;
                      const pillars = [...c.whatIsLuminArt.pillars];
                      pillars[i] = { ...pillars[i], description: e.target.value };
                      return {
                        ...c,
                        whatIsLuminArt: { ...c.whatIsLuminArt, pillars },
                      };
                    })
                  }
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </section>

        <hr className="border-foreground/10" />

        {/* CTA */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">CTA Section</h2>
          <div>
            <label className={labelClass}>Headline (use newline for line break; 2nd line gets accent color)</label>
            <textarea
              rows={2}
              value={content.cta.headline}
              onChange={(e) =>
                setContent((c) => c && { ...c, cta: { ...c.cta, headline: e.target.value } })
              }
              className={`${inputClass} resize-none`}
            />
          </div>
          <div>
            <label className={labelClass}>Subtext</label>
            <textarea
              rows={2}
              value={content.cta.subtext}
              onChange={(e) =>
                setContent((c) => c && { ...c, cta: { ...c.cta, subtext: e.target.value } })
              }
              className={`${inputClass} resize-none`}
            />
          </div>
          <div>
            <label className={labelClass}>Button text</label>
            <input
              type="text"
              value={content.cta.buttonText}
              onChange={(e) =>
                setContent((c) => c && { ...c, cta: { ...c.cta, buttonText: e.target.value } })
              }
              className={inputClass}
            />
          </div>
        </section>

        <div className="flex flex-wrap gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-primary-main px-6 py-2.5 font-medium text-white hover:bg-primary-main/90 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-foreground/20 px-6 py-2.5 font-medium text-foreground hover:bg-foreground/5"
          >
            Preview homepage
          </a>
        </div>
      </form>
    </AdminShell>
  );
}
