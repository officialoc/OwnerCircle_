```javascript
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // GANTI URL DI BAWAH DENGAN URL WEB APP KAMU
  const SUBMISSION_ENDPOINT = "https://script.google.com/macros/s/AKfycbwnvz_N6Vx3grpCICiAVCIP7JBHBph1hD2PG1VlCaS75C7nrwGVZRqhm-WQHJs3la6MMg/exec";

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

  if (!form) {
    console.error("Form registrationForm tidak ditemukan.");
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const fullName = form.elements["fullName"].value.trim();
    const phone = form.elements["phone"].value.trim();
    const business = form.elements["business"].value.trim();
    const businessType = form.elements["businessType"].value;
    const reason = form.elements["reason"].value.trim();
    const consent = document.getElementById("consent").checked;

    if (!fullName || !phone || !business || !businessType || !reason) {
      status.textContent = "Mohon lengkapi semua kolom.";
      return;
    }

    if (!consent) {
      status.textContent = "Mohon centang persetujuan penggunaan data.";
      return;
    }

    if (
      !SUBMISSION_ENDPOINT.startsWith("https://script.google.com/macros/s/") ||
      !SUBMISSION_ENDPOINT.endsWith("/exec")
    ) {
      status.textContent = "URL Google Sheets belum dipasang dengan benar.";
      return;
    }

    const button = form.querySelector('button[type="submit"]');

    if (button) {
      button.disabled = true;
      button.textContent = "Mengirim...";
    }

    status.textContent = "Sedang mengirim pendaftaran...";

    try {
      await fetch(SUBMISSION_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify({
          fullName,
          phone,
          business,
          businessType,
          reason,
          consent,
          submittedAt: new Date().toISOString()
        })
      });

      // Mode no-cors tidak bisa memastikan data tersimpan.
      // Tunggu sebentar sebelum menampilkan halaman berikutnya.
      await new Promise(resolve => setTimeout(resolve, 1500));

      window.location.href = "berhasil.html";

    } catch (error) {
      console.error("Gagal mengirim pendaftaran:", error);
      status.textContent =
        "Pengiriman gagal. Periksa koneksi internet dan coba lagi.";

      if (button) {
        button.disabled = false;
        button.textContent = "Kirim Pendaftaran ↗";
      }
    }
  });
});
```