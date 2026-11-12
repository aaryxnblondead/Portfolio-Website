"use client";

import { useContactSubmit } from "@/lib/use-contact-form";

/**
 * Contact form fields only — the posting, honeypot and fallback logic live in
 * useContactSubmit(), so this file is the markup it drives.
 */
export function ContactForm() {
  const { status, onSubmit, endpoint } = useContactSubmit();

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
      action={endpoint}
      method="POST"
      onSubmit={onSubmit}
      aria-label="Contact form"
    >
      <div className="contact-row">
        <div className="contact-field">
          <label htmlFor="cf-name">NAME</label>
          <input id="cf-name" name="name" type="text" autoComplete="name" enterKeyHint="next" required maxLength={80} />
        </div>
        <div className="contact-field">
          <label htmlFor="cf-email">EMAIL</label>
          <input
            id="cf-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="next"
            required
            maxLength={120}
          />
        </div>
      </div>
      <div className="contact-field">
        <label htmlFor="cf-message">MESSAGE</label>
        <textarea id="cf-message" name="message" required minLength={10} maxLength={4000} rows={6} enterKeyHint="send" />
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
