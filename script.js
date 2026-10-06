/*
  CARA MENAMBAH FOTO:
  1. Masukkan file gambar ke folder images/waifu, images/anime, atau images/penghormatan.
  2. Tambahkan satu data baru ke dalam array galleryData di bawah.
  3. Sesuaikan nama, umur, file, dan catatan.

  Contoh:
  {
    category: "waifu",
    name: "Tokisaki Kurumi",
    age: "17 tahun",
    image: "images/waifu/kurumi.jpg",
    note: "Karakter favorit."
  }
*/

const galleryData = [
  {
    category: "waifu",
    name: "Tokisaki Kurumi",
    age: "18 tahun",
    image: "images/waifu/₊˚ 🌹࿔ Kurumi Tokisaki.jpeg",
    note: "Nightmare"
  },
  {
    category: "waifu",
    name: "Yotogami Tohka",
    age: "15 tahun",
    image: "images/waifu/tohka.jpg",
    note: "Tuliskan catatan tentang foto ini."
  },
  {
    category: "waifu",
    name: "Nakano Nino",
    age: "17 tahun",
    image: "images/waifu/nino.jpg",
    note: "Tuliskan catatan tentang foto ini."
  },
  {
    category: "anime",
    name: "Contoh Karakter",
    age: "-",
    image: "images/anime/contoh.jpg",
    note: "Ganti data ini dengan foto milikmu."
  },
  {
    category: "penghormatan",
    name: "Contoh Penghormatan",
    age: "-",
    image: "images/penghormatan/contoh.jpg",
    note: "Tuliskan keterangan penghormatan di sini."
  }
];

const categoryLabels = {
  waifu: "Waifu",
  anime: "Anime",
  penghormatan: "Penghormatan"
};

const gallery = document.getElementById("gallery");
const emptyState = document.getElementById("emptyState");
const modal = document.getElementById("photoModal");
const modalImage = document.getElementById("modalImage");
const modalCategory = document.getElementById("modalCategory");
const modalName = document.getElementById("modalName");
const modalAge = document.getElementById("modalAge");
const modalNote = document.getElementById("modalNote");
const closeModal = document.getElementById("closeModal");

let activeCategory = "all";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderGallery() {
  const filtered = activeCategory === "all"
    ? galleryData
    : galleryData.filter(item => item.category === activeCategory);

  gallery.innerHTML = "";

  if (filtered.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  filtered.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <img
        class="card-image"
        src="${escapeHtml(item.image)}"
        alt="${escapeHtml(item.name)}"
        loading="lazy"
        onerror="this.src=''; this.alt='Foto belum ditemukan';"
      />
      <div class="card-body">
        <span class="badge">${escapeHtml(categoryLabels[item.category] || item.category)}</span>
        <h2 class="card-name">${escapeHtml(item.name)}</h2>
        <p class="card-meta">Umur: ${escapeHtml(item.age)}</p>
        <p class="card-note">${escapeHtml(item.note)}</p>
      </div>
    `;

    card.addEventListener("click", () => openModal(item));
    gallery.appendChild(card);
  });
}

function openModal(item) {
  modalImage.src = item.image;
  modalImage.alt = item.name;
  modalCategory.textContent = categoryLabels[item.category] || item.category;
  modalName.textContent = item.name;
  modalAge.textContent = item.age;
  modalNote.textContent = item.note;
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closePhotoModal() {
  modal.classList.add("hidden");
  document.body.style.overflow = "";
}

document.querySelectorAll(".category-btn").forEach(button => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;

    document.querySelectorAll(".category-btn").forEach(btn => {
      btn.classList.toggle("active", btn === button);
    });

    renderGallery();
  });
});

closeModal.addEventListener("click", closePhotoModal);

modal.addEventListener("click", event => {
  if (event.target === modal) {
    closePhotoModal();
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closePhotoModal();
  }
});

renderGallery();
