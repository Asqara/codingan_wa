const {
  useMultiFileAuthState,
  default: makeWASocket,
  fetchLatestBaileysVersion,
  delay,
  DisconnectReason,
} = require("@whiskeysockets/baileys");
const qrcode = require("qrcode-terminal");
const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let sock;
let isConnecting = false;
let isReady = false;
let hasAutoSent = false; // Flag untuk mencegah kirim berulang

// ================= TEMPLATE =================
const template = (nama) => `
✨ *EXTEND PEMBAYARAN MAKRAB* ✨

Halo ${nama} 👋

Jadii pembayaran + pendataan untuk makrab di *EXTEND* niih sampee tanggal *30 Desember*, yang artinyaa pembayaran MAKRAB (Termin 1) *sisa 3 hari lagi*! ⏳

🗓 MAKRAB: 21 – 22 Januari 2025
📍 Villa Anna (https://maps.app.goo.gl/x1JjP8qaVBRwkddU7)

💸 Pembayaran bisa dalam bentuk:
• Lunas
• nyicil per termin
• Pembayaran lunas di termin 2

🔗 Link Gform
https://ipb.link/makrabilkomerz61

🚨 Catatan Penting
Termin 1 pembayaran paling lambat di tanggal 30 Desember

Yuk pastiin pembayaran kalian udah aman yaa ✨ Kalau ada kendala, jangan sungkan buat hubungi panitia 🤍
`;

// ================= RANDOM DELAY =================
const randomDelay = (min = 2500, max = 4000) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// ================= BULK SEND FUNCTION =================
async function sendBulkMessages() {
  if (!isReady) {
    console.log("⚠️ WhatsApp belum ready");
    return;
  }

  if (hasAutoSent) {
    console.log("⚠️ Pesan sudah pernah dikirim otomatis");
    return;
  }

  console.log("\n🚀 Memulai pengiriman bulk message...\n");

  try {
    // Baca file CSV
    const csv = fs.readFileSync("./data_ilkom.csv", "utf-8").trim();
    const lines = csv.split("\n");

    const totalMessages = lines.length - 1;
    console.log(`📊 Total penerima: ${totalMessages}\n`);

    // Loop mulai dari index 1 (skip header)
    for (let i = 1; i < lines.length; i++) {
      const [nama, numberRaw] = lines[i].split(";");

      // Bersihkan nomor dari karakter non-digit
      const number = numberRaw.replace(/\D/g, "");
      const jid = `${number}@s.whatsapp.net`;

      try {
        // Kirim pesan
        await sock.sendMessage(jid, {
          text: template(nama),
          linkPreview: false,
        });

        console.log(
          `✅ (${i}/${totalMessages}) Terkirim ke ${nama} - ${number}`
        );
      } catch (err) {
        console.error(
          `❌ (${i}/${totalMessages}) Gagal ke ${nama} - ${err.message}`
        );
      }

      // Delay random sebelum pesan berikutnya
      const delayMs = randomDelay();
      await delay(delayMs);
      console.log(`   ⏳ Delay ${delayMs}ms\n`);
    }

    console.log("\n✅ Semua pesan berhasil dikirim!\n");
    hasAutoSent = true; // Set flag agar tidak kirim lagi
  } catch (err) {
    console.error("❌ Error saat mengirim bulk:", err);
  }
}

// ================= START WA =================
async function startWhatsApp() {
  if (isConnecting) return;
  isConnecting = true;

  const { version } = await fetchLatestBaileysVersion();
  const { state, saveCreds } = await useMultiFileAuthState("auth_alfath");

  sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    syncFullHistory: false,
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("\n📱 Scan QR Code di bawah:\n");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {
      console.log("\n✅ WhatsApp berhasil terkoneksi!\n");
      isReady = true;
      isConnecting = false;

      // 🔥 AUTO SEND setelah 3 detik koneksi stabil
      setTimeout(() => {
        sendBulkMessages();
      }, 3000);
    }

    if (connection === "close") {
      isReady = false;
      isConnecting = false;
      const reason = lastDisconnect?.error?.output?.statusCode;

      console.log(`❌ Koneksi terputus: ${reason}`);

      // DEVICE DICABUT → HARUS LOGIN ULANG
      if (reason === DisconnectReason.loggedOut) {
        console.log("⚠️ Session expired, menghapus auth_alfath...");
        fs.rmSync("auth_alfath", { recursive: true, force: true });
        return startWhatsApp();
      }

      // NORMAL RECONNECT
      console.log("🔄 Reconnecting dalam 3 detik...");
      await delay(3000);
      startWhatsApp();
    }
  });
}

// ================= START SERVER & WA =================
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
  console.log("📊 Status: http://localhost:3000/status\n");
});

startWhatsApp();
