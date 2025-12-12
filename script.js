/**
 * FUNGSI UTAMA: MENGGABUNGKAN SEMUA LOGIKA INTERAKSI DAN ANIMASI
 * - Transisi Halaman (Fade)
 * - Navigasi Aktif
 * - Efek Parallax Kartu (Link Card)
 * - Lightbox Galeri
 * - Pencarian Anggota
 * - Buku Tamu Digital (Local Storage)
 * - Loading Bar Halus
 * - Logika Audio Player (DIHAPUS)
 */

// ======================================================
// --- 1. LOGIKA LOADING BAR (Di luar DOMContentLoaded) ---
// ======================================================

const loadingBar = document.getElementById("loading-bar");
if (loadingBar) {
  let loadProgress = 0;

  // Simulasi kemajuan load hingga 95%
  const interval = setInterval(() => {
    loadProgress += 5;
    if (loadProgress >= 95) {
      clearInterval(interval);
      loadProgress = 95;
    }
    loadingBar.style.width = `${loadProgress}%`;
  }, 100);

  // Ketika semua konten (DOM, gambar, dll.) selesai dimuat
  window.addEventListener("load", () => {
    clearInterval(interval);
    loadingBar.style.width = "100%";

    // Sembunyikan bar setelah selesai (dengan transisi)
    setTimeout(() => {
      loadingBar.classList.add("hidden");
    }, 300);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // ======================================================
  // --- 2. PENGATUR TRANSISI HALAMAN (Fade) ---
  // ======================================================

  const allLinks = document.querySelectorAll(
    'a[href^="index.html"], a[href^="anggota_kelas.html"], a[href^="wali_kelas.html"], a[href^="galeri_kelas.html"]'
  );

  allLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const targetPage = this.getAttribute("href");

      const currentPath = window.location.pathname.split("/").pop();
      if (targetPage.split("/").pop() === currentPath || targetPage === "#") {
        return;
      }

      e.preventDefault();

      document.body.classList.add("fade-out");

      setTimeout(() => {
        window.location.href = targetPage;
      }, 200);
    });
  });

  const path = window.location.pathname;
  const page = path.split("/").pop().split("?")[0];

  const navElements = document.querySelectorAll(
    ".nav-tabs .tab, .sidebar-left .nav-icon"
  );

  navElements.forEach((el) => {
    el.classList.remove("active");

    let href = el.getAttribute("href");
    let targetPage = href.split("/").pop().split("?")[0];

    if (
      targetPage === page ||
      (page === "" && targetPage === "index.html") ||
      (page === "index.html" && targetPage === "index.html")
    ) {
      el.classList.add("active");
    }
  });

  // --- 4. Efek Hover Interaktif (Kartu Link - Homepage) ---
  const linkCards = document.querySelectorAll(".quick-links .link-card");

  linkCards.forEach((card) => {
    card.addEventListener("mousemove", function (e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const xVal = (x / rect.width - 0.5) * 20;
      const yVal = (y / rect.height - 0.5) * 20;

      card.style.transform = `perspective(1000px) rotateX(${
        yVal * -0.5
      }deg) rotateY(${xVal * 0.5}deg) scale(1.03)`;

      card.style.boxShadow = `
                ${xVal * 0.5}px ${yVal * 0.5}px 40px rgba(0, 0, 0, 0.6),
                inset 0 0 15px rgba(255, 255, 255, 0.1)
            `;
    });

    card.addEventListener("mouseout", function () {
      card.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
      card.style.boxShadow = "0 8px 32px 0 rgba(0, 0, 0, 0.4)";
    });
  });

  // --- 5. Fungsionalitas LIGHTBOX GALERI ---
  const modal = document.getElementById("lightbox-modal");
  if (modal) {
    const modalImg = document.getElementById("lightbox-img");
    const captionText = document.getElementById("lightbox-caption");
    const closeModal = document.querySelector(".lightbox-close");
    const photoCards = document.querySelectorAll(".photo-card");

    photoCards.forEach((card) => {
      card.addEventListener("click", function () {
        modal.style.display = "block";
        const imgElement = this.querySelector(".photo-thumbnail");
        const captionElement = this.querySelector(".photo-caption");

        modalImg.src = imgElement.src;
        captionText.innerHTML = captionElement.innerHTML;
      });
    });

    closeModal.onclick = function () {
      modal.style.display = "none";
    };

    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.style.display === "block") {
        modal.style.display = "none";
      }
    });
  }

  // --- 6. Fungsionalitas PENCARIAN ANGGOTA KELAS ---
  const searchBar = document.querySelector(".search-bar");
  const memberGrid = document.querySelector(".member-grid");

  if (searchBar && memberGrid) {
    const memberCards = memberGrid.querySelectorAll(".member-card");

    searchBar.addEventListener("keyup", function (e) {
      const searchTerm = e.target.value.toLowerCase();

      memberCards.forEach((card) => {
        const cardContent = card.textContent.toLowerCase(); // Cari di semua teks kartu

        if (cardContent.includes(searchTerm)) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  }

  // ====================================================
  // --- 7. BUKU TAMU DIGITAL (Local Storage) ---
  // ====================================================

  const messagesList = document.getElementById("messages-list");
  const submitButton = document.getElementById("submit-message");
  const messageInput = document.getElementById("message-input");
  const senderInput = document.getElementById("sender-input");
  const STORAGE_KEY = "xii3_guestbook_messages";

  // 7.1. Fungsi untuk menampilkan pesan ke DOM dengan animasi
  function appendMessageToDOM(message, sender) {
    if (!messagesList) return;

    const messageDiv = document.createElement("div");
    messageDiv.classList.add("guestbook-message");

    messageDiv.style.opacity = "0";
    messageDiv.style.transform = "translateY(10px)";
    messageDiv.style.transition =
      "opacity 0.5s ease-out, transform 0.5s ease-out";

    messageDiv.innerHTML = `
            <p>"${message}"</p>
            <small>— ${sender}</small>
        `;

    const header = messagesList.querySelector("h3");
    if (header) {
      messagesList.insertBefore(messageDiv, header.nextSibling);
    } else {
      messagesList.appendChild(messageDiv);
    }

    setTimeout(() => {
      messageDiv.style.opacity = "1";
      messageDiv.style.transform = "translateY(0)";
    }, 50);
  }

  // 7.2. Fungsi untuk memuat pesan dari Local Storage
  function loadMessages() {
    if (!messagesList) return;

    const storedMessages = JSON.parse(localStorage.getItem(STORAGE_KEY));

    const defaultMessages = [
      {
        message:
          "Selamat & Sukses untuk kita semua! Semoga persahabatan ini abadi.",
        sender: "(someone)",
      },
      {
        message:
          "Aku tidak akan pernah melupakan semua kenangan gila di kelas ini. Love you guys!",
        sender: "(someone)",
      },
    ];

    let messages = storedMessages || defaultMessages;

    messagesList.innerHTML = "<h3>Pesan dari Kawan Lama</h3>";

    messages.forEach((messageObj) => {
      const messageDiv = document.createElement("div");
      messageDiv.classList.add("guestbook-message");
      messageDiv.innerHTML = `
                <p>"${messageObj.message}"</p>
                <small>— ${messageObj.sender}</small>
            `;
      const header = messagesList.querySelector("h3");
      if (header) {
        messagesList.insertBefore(messageDiv, header.nextSibling);
      } else {
        messagesList.appendChild(messageDiv);
      }
    });
  }

  // 7.3. Event Listener Kirim Pesan
  if (submitButton) {
    submitButton.addEventListener("click", (e) => {
      e.preventDefault();

      const messageText = messageInput.value.trim();
      const senderName = senderInput.value.trim() || "Anonim";

      if (messageText.length < 5) {
        alert("Pesan terlalu pendek! Minimal 5 karakter.");
        return;
      }

      let currentMessages = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

      const newMessage = {
        message: messageText,
        sender: senderName,
      };

      currentMessages.unshift(newMessage); // Tambah di awal array (terbaru di atas)

      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentMessages));

      appendMessageToDOM(messageText, senderName);

      messageInput.value = "";
      senderInput.value = "";

      alert("Pesanmu telah berhasil dikirim! Silakan lihat di daftar pesan.");
    });
  }

  // Jalankan fungsi memuat pesan saat elemen ada
  if (messagesList) {
    loadMessages();
  }

  // ====================================================
  // --- 8. LOGIKA AUDIO PLAYER (DIHAPUS) ---
  // ====================================================

  // BLOK LOGIKA MUSIK DI SINI TELAH DIHAPUS SEPENUHNYA.
});
