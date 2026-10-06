const STORAGE_KEY = "my-anime-gallery-v2";
let activeCategory = "all";
let selectedPhotoId = null;
let selectedFileDataUrl = null;

const gallery = document.getElementById("gallery");
const emptyState = document.getElementById("emptyState");
const photoModal = document.getElementById("photoModal");
const addModal = document.getElementById("addModal");
const modalImage = document.getElementById("modalImage");
const modalCategory = document.getElementById("modalCategory");
const modalName = document.getElementById("modalName");
const modalAge = document.getElementById("modalAge");
const modalNote = document.getElementById("modalNote");
const storageMessage = document.getElementById("storageMessage");

const labels = { waifu:"Waifu", anime:"Anime", penghormatan:"Penghormatan" };

function getPhotos() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
}

function savePhotos(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
    .replaceAll('"',"&quot;").replaceAll("'","&#039;");
}

function renderGallery() {
  const photos = getPhotos().filter(p => activeCategory === "all" || p.category === activeCategory);
  gallery.innerHTML = "";
  emptyState.classList.toggle("hidden", photos.length !== 0);

  photos.forEach(item => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <img class="card-image" src="${item.image}" alt="${escapeHtml(item.name)}" loading="lazy">
      <div class="card-body">
        <span class="badge">${escapeHtml(labels[item.category])}</span>
        <h2 class="card-name">${escapeHtml(item.name)}</h2>
        <p class="card-meta">Umur: ${escapeHtml(item.age || "-")}</p>
        <p class="card-note">${escapeHtml(item.note || "")}</p>
      </div>`;
    card.addEventListener("click", () => openPhoto(item));
    gallery.appendChild(card);
  });
}

function openPhoto(item) {
  selectedPhotoId = item.id;
  modalImage.src = item.image;
  modalImage.alt = item.name;
  modalCategory.textContent = labels[item.category] || item.category;
  modalName.textContent = item.name;
  modalAge.textContent = item.age || "-";
  modalNote.textContent = item.note || "";
  photoModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closePhoto() {
  photoModal.classList.add("hidden");
  selectedPhotoId = null;
  document.body.style.overflow = "";
}

function resetForm() {
  document.getElementById("photoForm").reset();
  document.getElementById("fileName").textContent = "Belum ada file dipilih";
  document.getElementById("preview").src = "";
  document.getElementById("previewWrap").classList.add("hidden");
  selectedFileDataUrl = null;
}

function closeAddPhoto() {
  addModal.classList.add("hidden");
  document.body.style.overflow = "";
  resetForm();
}

document.querySelectorAll(".category-btn").forEach(button => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;
    document.querySelectorAll(".category-btn").forEach(b => b.classList.toggle("active", b === button));
    renderGallery();
  });
});

document.getElementById("addPhotoBtn").addEventListener("click", () => {
  addModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
});

document.getElementById("closeModal").addEventListener("click", closePhoto);
document.getElementById("closeAddModal").addEventListener("click", closeAddPhoto);
document.getElementById("cancelAdd").addEventListener("click", closeAddPhoto);

document.getElementById("photoModal").addEventListener("click", e => {
  if (e.target === photoModal) closePhoto();
});

document.getElementById("addModal").addEventListener("click", e => {
  if (e.target === addModal) closeAddPhoto();
});

document.getElementById("photoFile").addEventListener("change", e => {
  const file = e.target.files?.[0];
  if (!file) return;
  document.getElementById("fileName").textContent = file.name;
  const reader = new FileReader();
  reader.onload = () => {
    selectedFileDataUrl = reader.result;
    document.getElementById("preview").src = selectedFileDataUrl;
    document.getElementById("previewWrap").classList.remove("hidden");
  };
  reader.readAsDataURL(file);
});

document.getElementById("photoForm").addEventListener("submit", e => {
  e.preventDefault();
  if (!selectedFileDataUrl) {
    storageMessage.textContent = "Pilih foto terlebih dahulu.";
    return;
  }

  const item = {
    id: (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString()),
    category: document.getElementById("category").value,
    name: document.getElementById("name").value.trim(),
    age: document.getElementById("age").value.trim() || "-",
    note: document.getElementById("note").value.trim(),
    image: selectedFileDataUrl
  };

  try {
    const photos = getPhotos();
    photos.unshift(item);
    savePhotos(photos);
    activeCategory = item.category;
    document.querySelectorAll(".category-btn").forEach(b => b.classList.toggle("active", b.dataset.category === activeCategory));
    closeAddPhoto();
    renderGallery();
  } catch {
    storageMessage.textContent = "Penyimpanan browser penuh. Coba gunakan foto yang lebih kecil.";
  }
});

document.getElementById("deletePhotoBtn").addEventListener("click", () => {
  if (!selectedPhotoId) return;
  const photos = getPhotos();
  const target = photos.find(p => p.id === selectedPhotoId);
  if (!target) return;
  if (!confirm(`Hapus foto "${target.name}" dari browser ini?`)) return;
  savePhotos(photos.filter(p => p.id !== selectedPhotoId));
  closePhoto();
  renderGallery();
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    if (!photoModal.classList.contains("hidden")) closePhoto();
    if (!addModal.classList.contains("hidden")) closeAddPhoto();
  }
});

renderGallery();
