
"use strict";

const SUPABASE_URL = "sb_publishable_Ddd1UZl8onwtMYQcxikaUQ_S3vwkdmM";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_Ddd1UZl8onwtMYQcxikaUQ_S3vwkdmM";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

document.addEventListener("DOMContentLoaded", () => {
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

    const button = form.querySelector('button[type="submit"]');

    if (!form.reportValidity()) return;

    if (button) {
      button.disabled = true;
      button.textContent = "Mengirim...";
    }

    if (status) {
      status.textContent = "Sedang mengirim pendaftaran...";
    }

    const dataPendaftaran = {
      nama: document.getElementById("fullName").value.trim(),
      whatsapp: document.getElementById("phone").value.trim(),
      nama_usaha: document.getElementById("business").value.trim(),
      jenis_usaha: document.getElementById("businessType").value,
      alasan_bergabung: document.getElementById("reason").value.trim()
    };

    try {
      const { error } = await supabaseClient
        .from("pendaftaran")
        .insert([dataPendaftaran]);

      if (error) throw error;

      window.location.href = "Berhasil.html";
      return;
    } catch (error) {
      console.error("Gagal menyimpan pendaftaran:", error);

      if (status) {
        status.textContent =
          "Pendaftaran gagal disimpan. Silakan coba lagi.";
      }
    }

    if (button) {
      button.disabled = false;
      button.textContent = "Kirim Pendaftaran ↗";
    }
  });
});
