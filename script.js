
"use strict";

// URL endpoint akan diisi setelah layanan Excel dikonfigurasi.
// Biarkan kosong selama tahap belajar tampilan.
const SUBMISSION_ENDPOINT = "";

const $ = (selector) => document.querySelector(selector);

const loginPanel = $("#loginPanel");
const registrationPanel = $("#registrationPanel");
const statusMessage = $("#formStatus");

$("#year").textContent = new Date().getFullYear();

function openRegistration() {
  $("#register").scrollIntoView({ behavior: "smooth" });
  $("#loginName").focus({ preventScroll: true });
}

$("#navRegister").addEventListener("click", openRegistration);
$("#heroRegister").addEventListener("click", openRegistration);

$("#loginForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const name = $("#loginName").value.trim();
  const email = $("#loginEmail").value.trim();

  if (!name || !email) {
    statusMessage.textContent = "Isi nama dan email terlebih dahulu.";
    return;
  }

  // Nama dan email hanya menjadi identitas peserta.
  // Tidak ada verifikasi bahwa email benar-benar miliknya.
  $("#fullName").value = name;
  $("#email").value = email;
  $("#welcomeName").textContent = name;

  loginPanel.hidden = true;
  registrationPanel.hidden = false;
  statusMessage.textContent = "";

  $("#registrationPanel").scrollIntoView({ behavior: "smooth" });
});

$("#backButton").addEventListener("click", () => {
  registrationPanel.hidden = true;
  loginPanel.hidden = false;
  statusMessage.textContent = "";
  $("#loginPanel").scrollIntoView({ behavior: "smooth" });
});

$("#registrationForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const submitButton = $("#registrationForm button[type='submit']");

  // Ambil data dari form yang sudah divalidasi browser.
  const formData = new FormData(event.currentTarget);

  const payload = {
    fullName: String(formData.get("fullName") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    business: String(formData.get("business") || "").trim(),
    role: String(formData.get("role") || "").trim(),
    city: String(formData.get("city") || "").trim(),
    reason: String(formData.get("reason") || "").trim(),
    consent: $("#consent").checked,
    submittedAt: new Date().toISOString()
  };

  if (!payload.consent) {
    statusMessage.textContent = "Persetujuan penggunaan data wajib dicentang.";
    return;
  }

  if (!payload.fullName || !payload.email || !payload.phone ||
      !payload.business || !payload.role || !payload.city) {
    statusMessage.textContent = "Mohon lengkapi semua kolom wajib.";
    return;
  }

  if (!SUBMISSION_ENDPOINT) {
    statusMessage.textContent =
      "Formulir sudah siap, tetapi pengiriman online belum diaktifkan. " +
      "Hubungkan endpoint Excel terlebih dahulu.";
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Mengirim...";

  try {
    const response = await fetch(SUBMISSION_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("Pengiriman gagal");
    }

    statusMessage.textContent =
      "Pendaftaran berhasil dikirim. Terima kasih sudah bergabung!";

    event.currentTarget.reset();
    registrationPanel.hidden = true;
    loginPanel.hidden = false;
  } catch (error) {
    statusMessage.textContent =
      "Pendaftaran belum berhasil dikirim. Periksa koneksi atau coba lagi.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Kirim Pendaftaran ↗";
  }
});
