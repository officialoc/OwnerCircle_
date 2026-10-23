
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const SUBMISSION_ENDPOINT =
    "https://script.google.com/macros/s/AKfycbxKQcKSymmELgSJuVdKXFZyJ-J65ihUPEKj5WkH4lTbf7e3ZTRLB7MCuVvRsj__8nAs/exec";

  const SHEET_TAB = "contact";

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

  document.getElementById("navRegister")
    ?.addEventListener("click", openRegistration);

  document.getElementById("heroRegister")
    ?.addEventListener("click", openRegistration);

  const sourceSelect = document.getElementById("discoverySource");
  const otherSourceGroup = document.getElementById("otherSourceGroup");
  const otherSourceInput = document.getElementById("otherSource");

  function toggleOtherSource() {
    const showOther = sourceSelect?.value === "Lainnya";

    if (otherSourceGroup) {
      otherSourceGroup.hidden = !showOther;
    }

    if (otherSourceInput) {
      otherSourceInput.disabled = !showOther;
      otherSourceInput.required = showOther;

      if (!showOther) {
        otherSourceInput.value = "";
      }
    }
  }

  sourceSelect?.addEventListener("change", toggleOtherSource);
  toggleOtherSource();

  if (!form) {
    console.error("Form registrationForm tidak ditemukan.");
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const button = form.querySelector('button[type="submit"]');

    if (button) {
      button.disabled = true;
      button.textContent = "Mengirim...";
    }

    if (status) {
      status.textContent = "Sedang mengirim pendaftaran...";
    }

    const getValue = (id) =>
      document.getElementById(id)?.value.trim() || "";

    const discoverySource = getValue("discoverySource");
    const otherSource = getValue("otherSource");

    const sourceValue =
      discoverySource === "Lainnya" && otherSource
        ? `Lainnya: ${otherSource}`
        : discoverySource;

    const fields = {
      nama_lengkap: getValue("fullName"),
      nama_panggilan: getValue("nickname"),
      nama_bisnis: getValue("business"),
      jenis_usaha: getValue("businessType"),
      lama_usaha: getValue("businessDuration"),
      sosial_media: getValue("socialMedia"),
      sumber_informasi: sourceValue,
      keinginan_bergabung: getValue("reason")
    };

    try {
      const response = await fetch(SUBMISSION_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify({
          tab: SHEET_TAB,
          fields: fields
        })
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || result?.success === false) {
        throw new Error(
          result?.message ||
          result?.error ||
          "Pendaftaran gagal disimpan."
        );
      }

      if (status) {
        status.textContent = "Pendaftaran berhasil dikirim!";
      }

      window.location.href = "berhasil.html";

    } catch (error) {
      console.error("Gagal mengirim pendaftaran:", error);

      if (status) {
        status.textContent =
          "Pendaftaran belum dapat dipastikan tersimpan. " +
          "Silakan coba lagi atau hubungi panitia.";
      }

      if (button) {
        button.disabled = false;
        button.textContent = "Kirim Pendaftaran ↗";
      }
    }
  });
});
