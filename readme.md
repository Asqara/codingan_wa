🧰 Prasyarat

Pastikan perangkat sudah terinstall:

Node.js versi 18 LTS atau 20 LTS
👉 Cek versi:
```bash
node -v
```
npm (biasanya sudah termasuk Node.js)
```bash
npm -v
```

📦 Install Dependency

Masuk ke folder project, lalu jalankan:
```bash
npm install @whiskeysockets/baileys express cors qrcode-terminal
```
📌 Jika ingin lebih stabil (direkomendasikan):
```bash
npm install pino axios ws sharp
```
▶️ Menjalankan Aplikasi (Lokal)

Jalankan file utama:
```bash
node index.js
```
Jika berhasil, terminal akan menampilkan QR Code WhatsApp.

🔑 Login WhatsApp

Buka WhatsApp di HP

Pilih Linked Devices

Scan QR Code yang muncul di terminal

Tunggu hingga muncul:

✅ WhatsApp connected
🚀 Server running on http://localhost:3000

📁 Session login akan tersimpan otomatis di folder:

auth_alfath/

Selama folder ini ada, tidak perlu scan ulang.

📄 Format Data CSV

Pastikan file data_ilkom.csv menggunakan format:

nama;nomor_hp
Andi;081234567890
Budi;6281234567890

📌 Nomor akan otomatis dinormalisasi ke format WhatsApp.

⚠️ Jika Terjadi Error 401 / Session Expired

Jika muncul pesan:

Disconnected: 401
Session expired, delete auth_alfath

Solusi:

hapus folder auth_alfath
dan jalankan ulang
```bash
node index.js
```
Lalu scan QR ulang.

🛑 Menghentikan Program

Tekan:

CTRL + C
