"use client";

import { useRef, useState } from "react";

type Props = {
  accept: "pdf" | "image" | "video";
  prefix?: string;
  onUpload: (url: string) => void;
  buttonLabel?: string;
  className?: string;
  getHeaders: () => HeadersInit;
};

const ACCEPT_MAP = {
  pdf: "application/pdf",
  image: "image/jpeg,image/jpg,image/png,image/webp",
  video: "video/mp4,video/webm,video/quicktime",
};

export function FileUpload({
  accept,
  prefix = "catalogue",
  onUpload,
  buttonLabel = "Upload",
  className = "",
  getHeaders,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("prefix", prefix);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
        headers: getHeaders(),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Upload failed");
      }
      onUpload(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_MAP[accept]}
        onChange={handleChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="rounded-lg border border-foreground/20 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-foreground/5 disabled:opacity-60"
      >
        {uploading ? "Uploading…" : buttonLabel}
      </button>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
