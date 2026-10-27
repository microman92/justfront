"use client";

import { useState, type FormEvent } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error" | "unconfigured" | "limited">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          contact: data.get("contact"),
          service: data.get("service"),
          message: data.get("message"),
          website: data.get("website"),
        }),
      });
      if (!response.ok) {
        setStatus(response.status === 503 ? "unconfigured" : response.status === 429 ? "limited" : "error");
        return;
      }
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="contact-request" onSubmit={submit}>
      <div className="contact-trap" aria-hidden="true"><label>Оставьте поле пустым<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label></div>
      <label><span className="contact-field-label">Ваше имя</span><input autoComplete="name" maxLength={100} name="name" placeholder="Как к вам обращаться" required /></label>
      <label><span className="contact-field-label">Как с вами связаться</span><input autoComplete="on" maxLength={160} name="contact" placeholder="Телефон, Telegram или email" required /></label>
      <label><span className="contact-field-label">Что вам нужно</span><select defaultValue="" name="service"><option value="">Выберите направление</option><option>Сайт или веб-приложение</option><option>CRM или бизнес-система</option><option>Telegram-бот или Mini App</option><option>AI и автоматизация</option><option>Другая задача</option></select></label>
      <label><span className="contact-field-label">О задаче</span><textarea maxLength={1500} name="message" placeholder="Коротко опишите проект" required rows={3} /></label>
      <button className="form-submit" disabled={status === "sending"} type="submit">{status === "sending" ? "ОТПРАВЛЯЮ…" : "ОТПРАВИТЬ ЗАЯВКУ"}<span aria-hidden="true">↗</span></button>
      <p aria-live="polite" className={`contact-status ${status === "error" || status === "unconfigured" || status === "limited" ? "is-error" : ""}`} role="status">
        {status === "sent" && "Заявка отправлена. Спасибо, свяжусь с вами!"}
        {status === "error" && "Не удалось отправить заявку. Попробуйте ещё раз или напишите в Telegram."}
        {status === "unconfigured" && "Форма пока не настроена. Напишите мне в Telegram."}
        {status === "limited" && "Слишком много заявок. Попробуйте позже или напишите мне в Telegram."}
      </p>
    </form>
  );
}
