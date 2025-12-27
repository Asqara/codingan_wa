🧰 Prasyarat

Pastikan perangkat sudah terinstall:

Node.js versi 18 LTS atau 20 LTS
👉 Cek versi:

node -v

npm (biasanya sudah termasuk Node.js)

npm -v

📂 Struktur Folder
project-folder/
│
├── index.js
├── data_ilkom.csv
├── package.json
├── README.md
└── auth_alfath/ (otomatis dibuat setelah login WA)

📦 Install Dependency

Masuk ke folder project, lalu jalankan:

npm install @whiskeysockets/baileys express cors qrcode-terminal

📌 Jika ingin lebih stabil (direkomendasikan):

npm install pino axios ws sharp

▶️ Menjalankan Aplikasi (Lokal)

Jalankan file utama:

node index.js

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

rm -rf auth_alfath
node index.js

Lalu scan QR ulang.

🛑 Menghentikan Program

Tekan:

CTRL + C
