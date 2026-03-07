"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const PROJECT_TYPES = [
  "Residential",
  "Commercial",
  "Hospitality",
  "Retail",
  "Office",
  "Public / Institutional",
  "Other",
];

export function CollaborationForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: "",
    firmName: "",
    email: "",
    phone: "",
    projectType: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrors([]);

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok && data.ok) {
      setStatus("success");
      setForm({ name: "", firmName: "", email: "", phone: "", projectType: "", message: "" });
    } else {
      setStatus("error");
      setErrors(Array.isArray(data.errors) ? data.errors : ["Something went wrong."]);
    }
  };

  const handleChange = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
  };

  return (
    <div className="mx-auto max-w-2xl">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl border border-primary-200 bg-primary-50/50 p-10 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-main text-2xl text-white"
            >
              ✓
            </motion.div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Thank You
            </h2>
            <p className="mt-3 text-foreground/70">
              We&apos;ll be in touch soon to discuss your project.
            </p>
            <Link
              href="/"
              className="mt-8 inline-block rounded-lg bg-primary-main px-6 py-3 font-medium text-white transition-colors hover:bg-primary-800"
            >
              Back to Home
            </Link>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {errors.length > 0 && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                <ul className="list-inside list-disc space-y-1">
                  {errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange("name")}
                  className="w-full rounded-lg border border-foreground/20 bg-background px-4 py-3 text-foreground placeholder:text-foreground/50 focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="firmName" className="mb-1.5 block text-sm font-medium text-foreground">
                  Firm Name
                </label>
                <input
                  id="firmName"
                  type="text"
                  required
                  value={form.firmName}
                  onChange={handleChange("firmName")}
                  className="w-full rounded-lg border border-foreground/20 bg-background px-4 py-3 text-foreground placeholder:text-foreground/50 focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
                  placeholder="Your firm or studio"
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange("email")}
                  className="w-full rounded-lg border border-foreground/20 bg-background px-4 py-3 text-foreground placeholder:text-foreground/50 focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
                  placeholder="you@firm.com"
                />
              </div>
              <div>
                <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-foreground">
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={handleChange("phone")}
                  className="w-full rounded-lg border border-foreground/20 bg-background px-4 py-3 text-foreground placeholder:text-foreground/50 focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>

            <div>
              <label htmlFor="projectType" className="mb-1.5 block text-sm font-medium text-foreground">
                Project Type
              </label>
              <select
                id="projectType"
                required
                value={form.projectType}
                onChange={handleChange("projectType")}
                className="w-full rounded-lg border border-foreground/20 bg-background px-4 py-3 text-foreground focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
              >
                <option value="">Select project type</option>
                {PROJECT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-foreground">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={form.message}
                onChange={handleChange("message")}
                className="w-full resize-none rounded-lg border border-foreground/20 bg-background px-4 py-3 text-foreground placeholder:text-foreground/50 focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
                placeholder="Tell us about your project, timeline, and lighting requirements..."
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={status === "loading"}
                className="group flex items-center gap-2 rounded-lg bg-primary-main px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-primary-800 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === "loading" ? (
                  "Sending..."
                ) : (
                  <>
                    Send Request
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </>
                )}
              </button>
              <Link
                href="/"
                className="text-foreground/70 hover:text-foreground transition-colors"
              >
                Cancel
              </Link>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
