# My Anime Gallery

Website galeri statis untuk GitHub + Cloudflare Pages, tanpa R2.

## Struktur

- `index.html` = halaman utama
- `style.css` = tampilan
- `script.js` = data foto dan logika kategori
- `images/waifu/` = foto kategori Waifu
- `images/anime/` = foto kategori Anime
- `images/penghormatan/` = foto kategori Penghormatan

## Menambah foto

1. Masukkan foto ke folder kategori yang sesuai.
2. Buka `script.js`.
3. Tambahkan data foto baru ke `galleryData`.
4. Commit/push ke GitHub.
5. Cloudflare Pages akan memperbarui website dari repository.

Contoh data:

{
  category: "waifu",
  name: "Tokisaki Kurumi",
  age: "17 tahun",
  image: "images/waifu/kurumi.jpg",
  note: "Catatan foto."
}

Nama file dan huruf besar/kecil harus sama persis dengan file di folder.
