"use client";

import { useState, type FormEvent } from "react";

/**
 * Posting to aaryansingh2810@gmail.com straight from the browser via
 * FormSubmit, so the contact form works on a fully static export with no
 * server of its own. AJAX first for an inline receipt; the native POST
 * action underneath keeps it working with JS off.
 *
 * NOTE: the very first submission triggers a one-time activation email from
 * FormSubmit that must be clicked before anything is delivered.
 */

const ENDPOINT = "https://formsubmit.co/aaryansingh2810@gmail.com";
const AJAX_ENDPOINT = "https://formsubmit.co/ajax/aaryansingh2810@gmail.com";
const TIMEOUT_MS = 15_000;

export type ContactStatus = "idle" | "sending" | "sent" | "error";

/** The honeypot. A filled field means a bot, and bots get a silent success. */
function isBot(data: FormData): boolean {
  return String(data.get("_honey") ?? "").trim() !== "";
}

function payload(data: FormData) {
  const name = String(data.get("name") ?? "");
  return {
    name,
    email: String(data.get("email") ?? ""),
    message: String(data.get("message") ?? ""),
    _subject: `Portfolio contact from ${name || "the site"}`,
    _template: "table",
    _honey: "",
  };
}

/**
 * Mobile networks hang and mobile blockers kill the AJAX endpoint, so the
 * fetch gets a timeout — and any failure falls back to a native POST, which
 * always delivers instead of stranding the button.
 */
async function postAjax(data: FormData) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(AJAX_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload(data)),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  } finally {
    window.clearTimeout(timer);
  }
}

export function useContactSubmit() {
  const [status, setStatus] = useState<ContactStatus>("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const data = new FormData(form);

    if (isBot(data)) {
      setStatus("sent");
      return;
    }

    setStatus("sending");
    try {
      await postAjax(data);
      setStatus("sent");
      form.reset();
    } catch {
      try {
        form.submit();
      } catch {
        setStatus("error");
      }
    }
  }

  return { status, onSubmit, endpoint: ENDPOINT };
}
