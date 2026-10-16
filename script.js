"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const SUBMISSION_ENDPOINT = "https://formspree.io/f/meaevlqj";

  const form = document.getElementById("registrationForm");
  const status = document.getElementById("formStatus");

  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  function openRegistration() {
    document.getElementById("register")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  document.getElementById("navRegister")?.addEventListener("click", openRegistration);
  document.getElementById("heroRegister")?.addEventListener("click", openRegistration);

  if (!form) {
    console.error("Form registrationForm tidak ditemukan.");
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const button = form.querySelector('button[type="submit"]');

    if (button) {
      button.disabled = true;
      button.textContent = "Mengirim...";
    }

    if (status) {
      status.textContent = "Sedang mengirim pendaftaran...";
    }

    try {
      const response = await fetch(SUBMISSION_ENDPOINT, {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        window.location.href = "berhasil.html";
        return;
      }

      const result = await response.json().catch(() => ({}));

      if (status) {
        status.textContent =
          result.errors?.map(error => error.message).join(", ") ||
          "Pendaftaran gagal dikirim. Silakan coba lagi.";
      }
    } catch (error) {
      console.error("Gagal mengirim pendaftaran:", error);

      if (status) {
        status.textContent =
          "Koneksi bermasalah. Periksa internet lalu coba lagi.";
      }
    }

    if (button) {
      button.disabled = false;
      button.textContent = "Kirim Pendaftaran ↗";
    }
  });
});