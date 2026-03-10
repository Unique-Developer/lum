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

function xhrUpload(
  url: string,
  body: File | FormData,
  options: { contentType?: string; onProgress?: (percent: number) => void }
): Promise<Response> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    if (options.contentType) xhr.setRequestHeader("Content-Type", options.contentType);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && options.onProgress) {
        options.onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = () =>
      resolve(
        new Response(xhr.responseText, {
          status: xhr.status,
          statusText: xhr.statusText,
        })
      );
    xhr.onerror = () => reject(new Error("Network error"));
    xhr.send(body as never);
  });
}

function xhrFormUpload(
  url: string,
  formData: FormData,
  headers: HeadersInit,
  onProgress?: (percent: number) => void
): Promise<Response> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    Object.entries(headers as Record<string, string>).forEach(([k, v]) => {
      if (k.toLowerCase() === "content-type") return; // Let browser set for FormData
      if (typeof v === "string") xhr.setRequestHeader(k, v);
    });

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = () =>
      resolve(
        new Response(xhr.responseText, {
          status: xhr.status,
          statusText: xhr.statusText,
        })
      );
    xhr.onerror = () => reject(new Error("Network error"));
    xhr.send(formData);
  });
}

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
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setProgress(0);
    if (file.size > MAX_FILE_SIZE) {
      setError("File too large. Maximum size is 100 MB.");
      return;
    }

    setUploading(true);
    const headers = getHeaders();
    const useServerFallback = file.size <= SERVER_UPLOAD_LIMIT;

    try {
      // 1. Try presigned direct upload (supports up to 100MB; R2 CORS may be needed for PUT)
      const presignRes = await fetch(
        `/api/admin/upload/presign?filename=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}&prefix=${encodeURIComponent(prefix)}`,
        { headers }
      );
      const presignData = await presignRes.json();
      if (presignRes.ok) {
        const uploadRes = await xhrUpload(presignData.uploadUrl, file, {
          contentType: file.type,
          onProgress: setProgress,
        });
        if (uploadRes.ok) {
          onUpload(presignData.publicUrl);
          e.target.value = "";
          setUploading(false);
          setProgress(0);
          return;
        }
      }

      // 2. For files > 4MB, presigned is required (server upload hits Vercel body limit)
      if (!useServerFallback) {
        setError(
          "Upload failed. Files over 4 MB require direct upload. Configure R2 CORS to allow PUT (see BACKEND-SETUP.md, Step 2.7)."
        );
        setUploading(false);
        setProgress(0);
        e.target.value = "";
        return;
      }
    } catch {
      if (!useServerFallback) {
        setError(
          "Upload failed. Files over 4 MB require R2 CORS to allow PUT. See BACKEND-SETUP.md."
        );
        setUploading(false);
        setProgress(0);
        e.target.value = "";
        return;
      }
    }

    // 3. Fallback for small files only: upload via API (≤ 4MB)
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("prefix", prefix);
      const res = await xhrFormUpload("/api/admin/upload", formData, headers, setProgress);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      onUpload(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
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
      <div className="flex flex-col gap-1.5">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-lg border border-foreground/20 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-foreground/5 disabled:opacity-60"
        >
          {uploading ? `Uploading… ${progress}%` : buttonLabel}
        </button>
        {uploading && (
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
            <div
              className="h-full rounded-full bg-primary-main transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
