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

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const SERVER_UPLOAD_LIMIT = 4 * 1024 * 1024; // 4MB — Vercel body limit ~4.5MB; only use server fallback below this

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
    if (file.size > MAX_FILE_SIZE) {
      setError("File too large. Maximum size is 100 MB.");
      return;
    }

    setUploading(true);
    const headers = getHeaders();
    const useServerFallback = file.size <= SERVER_UPLOAD_LIMIT;

    try {
      // 1. Try presigned direct upload (supports up to 100MB; requires B2 CORS to allow PUT)
      const presignRes = await fetch(
        `/api/admin/upload/presign?filename=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}&prefix=${encodeURIComponent(prefix)}`,
        { headers }
      );
      const presignData = await presignRes.json();
      if (presignRes.ok) {
        const uploadRes = await fetch(presignData.uploadUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });
        if (uploadRes.ok) {
          onUpload(presignData.publicUrl);
          e.target.value = "";
          setUploading(false);
          return;
        }
      }

      // 2. For files > 4MB, presigned is required (server upload hits Vercel body limit)
      if (!useServerFallback) {
        setError(
          "Upload failed. Files over 4 MB require direct upload. Configure B2 CORS to allow PUT from your site (see BACKEND-SETUP.md, Step 2.6)."
        );
        setUploading(false);
        e.target.value = "";
        return;
      }
    } catch {
      if (!useServerFallback) {
        setError(
          "Upload failed. Files over 4 MB require B2 CORS to allow PUT. See BACKEND-SETUP.md."
        );
        setUploading(false);
        e.target.value = "";
        return;
      }
    }

    // 3. Fallback for small files only: upload via API (≤ 4MB)
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("prefix", prefix);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
        headers,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
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
