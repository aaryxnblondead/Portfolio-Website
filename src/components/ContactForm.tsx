"use client";

import { useState, type FormEvent } from "react";

/**
 * Contact form posting straight to aaryansingh2810@gmail.com via the
 * FormSubmit endpoint, so it works on a fully static export with no
 * server of its own. AJAX first for an inline receipt; the native POST
 * action underneath keeps it working with JS off. A honeypot field
 * absorbs the bots. NOTE: the very first submission triggers a one-time
 * activation email from FormSubmit that must be clicked.
 */

const ENDPOINT = "https://formsubmit.co/aaryansingh2810@gmail.com";
const AJAX_ENDPOINT = "https://formsubmit.co/ajax/aaryansingh2810@gmail.com";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    // Honeypot filled: say nothing, pretend it worked.
    if (String(data.get("_honey") ?? "").trim() !== "") {
      setStatus("sent");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(AJAX_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          message: String(data.get("message") ?? ""),
          _subject: `Portfolio contact from ${String(data.get("name") ?? "the site")}`,
          _template: "table",
          _honey: "",
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="contact-done" role="status">
        <span className="neo-index">RECEIVED</span>
        <p>Sent. I read everything that arrives through this form.</p>
      </div>
    );
  }

  return (
    <form
      className="contact-form"
      action={ENDPOINT}
      method="POST"
      onSubmit={onSubmit}
      aria-label="Contact form"
    >
      <div className="contact-row">
        <div className="contact-field">
          <label htmlFor="cf-name">NAME</label>
          <input id="cf-name" name="name" type="text" autoComplete="name" required maxLength={80} />
        </div>
        <div className="contact-field">
          <label htmlFor="cf-email">EMAIL</label>
          <input id="cf-email" name="email" type="email" autoComplete="email" required maxLength={120} />
        </div>
      </div>
      <div className="contact-field">
        <label htmlFor="cf-message">MESSAGE</label>
        <textarea id="cf-message" name="message" required minLength={10} maxLength={4000} rows={6} />
      </div>
      <input type="hidden" name="_subject" value="Portfolio contact" />
      <input type="hidden" name="_template" value="table" />
      <input
        type="text"
        name="_honey"
        className="contact-honey"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <button className="contact-submit" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "SENDING" : "SEND ↗"}
      </button>
      {status === "error" && (
        <p className="contact-error" role="alert">
          The form misfired. Email me directly at{" "}
          <a href="mailto:aaryansingh2810@gmail.com">aaryansingh2810@gmail.com</a>.
        </p>
      )}
    </form>
  );
}
