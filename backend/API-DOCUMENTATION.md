# Esensi Backend API Documentation

Dokumentasi lengkap untuk semua API endpoints dalam sistem Esensi.

## Table of Contents

1. [Authentication APIs](#authentication-apis)
2. [Internal APIs](#internal-apis) 
   - [Author Management](#author-management)
   - [Configuration Management](#configuration-management)
   - [Notification Management](#notification-management)
   - [Affiliate Management](#affiliate-management)
   - [Customer Management](#customer-management)
   - [Publisher Management](#publisher-management)
   - [Internal User Management](#internal-user-management)
   - [Dashboard & Analytics](#dashboard--analytics)
   - [Other Internal APIs](#other-internal-apis)
3. [Publishing APIs](#publishing-apis)
4. [Chapter APIs](#chapter-apis)
5. [Main Application APIs](#main-application-apis)
6. [File & Upload APIs](#file--upload-apis)
7. [General Usage](#general-usage)
8. [Error Handling](#error-handling)
9. [Security Notes](#security-notes)

---

## Authentication APIs

### 1. User (`user.ts`)
- **URL**: `/api/auth/user`
- **Purpose**: Mendapatkan data user berdasarkan username atau email
- **Parameters**:
  - `username`: string - Username atau email user (wajib)

### 2. User Detail (`user-detail.ts`)
- **URL**: `/api/auth/user/detail`
- **Purpose**: Mendapatkan detail lengkap user
- **Parameters**:
  - `id`: string - ID user (wajib)

### 3. User Update (`user-update.ts`)
- **URL**: `/api/auth/user/update`
- **Purpose**: Memperbarui data user
- **Parameters**:
  - `id`: string - ID user (wajib)
  - `data`: Partial<User> - Data user yang akan diperbarui

### 4. Account Detail (`account-detail.ts`)
- **URL**: `/api/auth/account/detail`
- **Purpose**: Mendapatkan detail akun
- **Parameters**:
  - `id`: string - ID akun (wajib)

### 5. Account List (`account-list.ts`)
- **URL**: `/api/auth/account/list`
- **Purpose**: Mendapatkan daftar akun dengan pagination
- **Parameters**:
  - `page?`: number - Halaman untuk pagination (default: 1)
  - `limit?`: number - Jumlah data per halaman (default: 10)
  - `search?`: string - Pencarian berdasarkan nama atau email

### 6. Role Check (`role-check.ts`)
- **URL**: `/api/auth/role/check`
- **Purpose**: Mengecek role/permission user
- **Parameters**:
  - `user_id`: string - ID user (wajib)
  - `role`: string - Role yang dicek (wajib)

---

## Internal APIs

### Author Management

#### 1. Author Create (`author-create.ts`)
- **URL**: `/api/internal/author/create`
- **Purpose**: Membuat author baru
- **Parameters**:
  - `name`: string - Nama author (wajib)
  - `biography?`: string - Biografi author
  - `social_media?`: string - Media sosial
  - `avatar?`: string - Avatar author
  - `id_account?`: string - ID akun terkait
  - `id_user?`: string - ID user terkait
  - `cfg?`: Record<string, any> - Konfigurasi tambahan

#### 2. Author List (`author-list.ts`)
- **URL**: `/api/internal/author/list`
- **Purpose**: Mendapatkan daftar author
- **Parameters**:
  - `page?`: number - Halaman untuk pagination
  - `limit?`: number - Jumlah data per halaman
  - `search?`: string - Pencarian berdasarkan nama

#### 3. Author Get (`author-get.ts`)
- **URL**: `/api/internal/author/get`
- **Purpose**: Mendapatkan detail author
- **Parameters**:
  - `id`: string - ID author (wajib)

#### 4. Author Update (`author-update.ts`)
- **URL**: `/api/internal/author/update`
- **Purpose**: Memperbarui data author
- **Parameters**:
  - `id`: string - ID author (wajib)
  - `name?`: string - Nama author
  - `biography?`: string - Biografi author
  - `social_media?`: string - Media sosial
  - `avatar?`: string - Avatar author
  - `cfg?`: Record<string, any> - Konfigurasi tambahan

#### 5. Author Delete (`author-delete.ts`)
- **URL**: `/api/internal/author/delete`
- **Purpose**: Menghapus author
- **Parameters**:
  - `id`: string - ID author (wajib)
  - `hard_delete?`: boolean - Hapus permanen (default: false)

#### 6. Author Search (`author-search.ts`)
- **URL**: `/api/internal/author/search`
- **Purpose**: Pencarian author dengan filter lanjutan
- **Parameters**:
  - `query?`: string - Teks pencarian
  - `has_books?`: boolean - Filter berdasarkan kepemilikan buku
  - `sort_by?`: string - Kolom sorting
  - `sort_order?`: "asc" | "desc" - Urutan sorting

#### 7. Author Stats (`author-stats.ts`)
- **URL**: `/api/internal/author/stats`
- **Purpose**: Mendapatkan statistik author
- **Parameters**:
  - `id?`: string - ID author spesifik
  - `date_from?`: string - Tanggal mulai
  - `date_to?`: string - Tanggal akhir

#### 8. Author Bulk Update (`author-bulk-update.ts`)
- **URL**: `/api/internal/author/bulk/update`
- **Purpose**: Memperbarui multiple author sekaligus
- **Parameters**:
  - `authors`: Array<{id: string, data: Partial<Author>}> - Array author yang akan diperbarui

### Configuration Management

#### 1. Config Create (`cfg-create.ts`)
- **URL**: `/api/internal/cfg/create`
- **Purpose**: Membuat konfigurasi baru
- **Parameters**:
  - `key`: string - Key konfigurasi (wajib)
  - `value`: any - Value konfigurasi (wajib)
  - `type?`: string - Tipe konfigurasi
  - `description?`: string - Deskripsi konfigurasi

#### 2. Config List (`cfg-list.ts`)
- **URL**: `/api/internal/cfg/list`
- **Purpose**: Mendapatkan daftar konfigurasi
- **Parameters**:
  - `page?`: number - Halaman untuk pagination
  - `limit?`: number - Jumlah data per halaman
  - `type?`: string - Filter berdasarkan tipe

#### 3. Config Get (`cfg-get.ts`)
- **URL**: `/api/internal/cfg/get`
- **Purpose**: Mendapatkan konfigurasi berdasarkan key
- **Parameters**:
  - `key`: string - Key konfigurasi (wajib)

#### 4. Config Update (`cfg-update.ts`)
- **URL**: `/api/internal/cfg/update`
- **Purpose**: Memperbarui konfigurasi
- **Parameters**:
  - `key`: string - Key konfigurasi (wajib)
  - `value?`: any - Value baru
  - `description?`: string - Deskripsi baru

#### 5. Config Delete (`cfg-delete.ts`)
- **URL**: `/api/internal/cfg/delete`
- **Purpose**: Menghapus konfigurasi
- **Parameters**:
  - `key`: string - Key konfigurasi (wajib)

### Notification Management

#### 1. Notification Create (`notif-create.ts`)
- **URL**: `/api/internal/notif/create`
- **Purpose**: Membuat notifikasi baru
- **Parameters**:
  - `title`: string - Judul notifikasi (wajib)
  - `message`: string - Pesan notifikasi (wajib)
  - `type`: string - Tipe notifikasi (wajib)
  - `recipient_id`: string - ID penerima (wajib)
  - `data?`: Record<string, any> - Data tambahan

#### 2. Notification List (`notif-list.ts`)
- **URL**: `/api/internal/notif/list`
- **Purpose**: Mendapatkan daftar notifikasi
- **Parameters**:
  - `user_id`: string - ID user (wajib)
  - `page?`: number - Halaman untuk pagination
  - `limit?`: number - Jumlah data per halaman
  - `unread_only?`: boolean - Hanya notifikasi belum dibaca

#### 3. Notification Update (`notif-update.ts`)
- **URL**: `/api/internal/notif/update`
- **Purpose**: Memperbarui status notifikasi
- **Parameters**:
  - `id`: string - ID notifikasi (wajib)
  - `is_read?`: boolean - Status dibaca
  - `is_archived?`: boolean - Status arsip

#### 4. Notification Delete (`notif-delete.ts`)
- **URL**: `/api/internal/notif/delete`
- **Purpose**: Menghapus notifikasi
- **Parameters**:
  - `id`: string - ID notifikasi (wajib)

### Affiliate Management

#### 1. Affiliate Create (`affiliate-create.ts`)
- **URL**: `/api/internal/affiliate/create`
- **Purpose**: Membuat affiliate baru
- **Parameters**:
  - `name`: string - Nama affiliate (wajib)
  - `id_account?`: string - ID akun terkait
  - `id_user?`: string - ID user terkait

#### 2. Affiliate List (`affiliate-list.ts`)
- **URL**: `/api/internal/affiliate/list`
- **Purpose**: Mendapatkan daftar affiliate
- **Parameters**:
  - `page?`: number - Halaman untuk pagination
  - `limit?`: number - Jumlah data per halaman
  - `search?`: string - Pencarian berdasarkan nama

#### 3. Affiliate Get (`affiliate-get.ts`)
- **URL**: `/api/internal/affiliate/get`
- **Purpose**: Mendapatkan detail affiliate
- **Parameters**:
  - `id`: string - ID affiliate (wajib)

#### 4. Affiliate Update (`affiliate-update.ts`)
- **URL**: `/api/internal/affiliate/update`
- **Purpose**: Memperbarui data affiliate
- **Parameters**:
  - `id`: string - ID affiliate (wajib)
  - `name?`: string - Nama affiliate
  - `id_account?`: string - ID akun terkait
  - `id_user?`: string - ID user terkait

#### 5. Affiliate Delete (`affiliate-delete.ts`)
- **URL**: `/api/internal/affiliate/delete`
- **Purpose**: Menghapus affiliate
- **Parameters**:
  - `id`: string - ID affiliate (wajib)
  - `hard_delete?`: boolean - Hapus permanen (default: false)

#### 6. Affiliate Search (`affiliate-search.ts`)
- **URL**: `/api/internal/affiliate/search`
- **Purpose**: Pencarian affiliate dengan filter lanjutan
- **Parameters**:
  - `query?`: string - Teks pencarian
  - `has_sales?`: boolean - Filter berdasarkan penjualan
  - `sort_by?`: string - Kolom sorting
  - `sort_order?`: "asc" | "desc" - Urutan sorting

#### 7. Affiliate Stats (`affiliate-stats.ts`)
- **URL**: `/api/internal/affiliate/stats`
- **Purpose**: Mendapatkan statistik affiliate
- **Parameters**:
  - `id?`: string - ID affiliate spesifik
  - `date_from?`: string - Tanggal mulai
  - `date_to?`: string - Tanggal akhir

### Customer Management

#### 1. Customer Create (`customer-create.ts`)
- **URL**: `/api/internal/customer/create`
- **Purpose**: Membuat customer baru
- **Parameters**:
  - `name`: string - Nama customer (wajib)
  - `email`: string - Email customer (wajib)
  - `whatsapp`: string - WhatsApp customer (wajib)
  - `id_account?`: string - ID akun terkait
  - `id_user?`: string - ID user terkait
  - `otp?`: number - Kode OTP

#### 2. Customer List (`customer-list.ts`)
- **URL**: `/api/internal/customer/list`
- **Purpose**: Mendapatkan daftar customer
- **Parameters**:
  - `page?`: number - Halaman untuk pagination
  - `limit?`: number - Jumlah data per halaman
  - `search?`: string - Pencarian berdasarkan nama atau email

#### 3. Customer Get (`customer-get.ts`)
- **URL**: `/api/internal/customer/get`
- **Purpose**: Mendapatkan detail customer
- **Parameters**:
  - `id`: string - ID customer (wajib)

#### 4. Customer Update (`customer-update.ts`)
- **URL**: `/api/internal/customer/update`
- **Purpose**: Memperbarui data customer
- **Parameters**:
  - `id`: string - ID customer (wajib)
  - `name?`: string - Nama customer
  - `email?`: string - Email customer
  - `whatsapp?`: string - WhatsApp customer
  - `otp?`: number - Kode OTP

#### 5. Customer Delete (`customer-delete.ts`)
- **URL**: `/api/internal/customer/delete`
- **Purpose**: Menghapus customer
- **Parameters**:
  - `id`: string - ID customer (wajib)
  - `hard_delete?`: boolean - Hapus permanen (default: false)

#### 6. Customer Search (`customer-search.ts`)
- **URL**: `/api/internal/customer/search`
- **Purpose**: Pencarian customer dengan filter lanjutan
- **Parameters**:
  - `query?`: string - Teks pencarian
  - `has_purchases?`: boolean - Filter berdasarkan pembelian
  - `verified_only?`: boolean - Hanya customer terverifikasi
  - `sort_by?`: string - Kolom sorting
  - `sort_order?`: "asc" | "desc" - Urutan sorting

#### 7. Customer Stats (`customer-stats.ts`)
- **URL**: `/api/internal/customer/stats`
- **Purpose**: Mendapatkan statistik customer
- **Parameters**:
  - `id?`: string - ID customer spesifik
  - `date_from?`: string - Tanggal mulai
  - `date_to?`: string - Tanggal akhir

### Publisher Management

#### 1. Publisher Create (`publisher-create.ts`)
- **URL**: `/api/internal/publisher/create`
- **Purpose**: Membuat publisher baru
- **Parameters**:
  - `name`: string - Nama publisher (wajib)
  - `description?`: string - Deskripsi publisher
  - `website?`: string - Website publisher
  - `address?`: string - Alamat publisher
  - `logo?`: string - Logo publisher
  - `id_account?`: string - ID akun terkait
  - `id_user?`: string - ID user terkait

#### 2. Publisher List (`publisher-list.ts`)
- **URL**: `/api/internal/publisher/list`
- **Purpose**: Mendapatkan daftar publisher
- **Parameters**:
  - `page?`: number - Halaman untuk pagination
  - `limit?`: number - Jumlah data per halaman
  - `search?`: string - Pencarian berdasarkan nama

#### 3. Publisher Get (`publisher-get.ts`)
- **URL**: `/api/internal/publisher/get`
- **Purpose**: Mendapatkan detail publisher
- **Parameters**:
  - `id`: string - ID publisher (wajib)

#### 4. Publisher Update (`publisher-update.ts`)
- **URL**: `/api/internal/publisher/update`
- **Purpose**: Memperbarui data publisher
- **Parameters**:
  - `id`: string - ID publisher (wajib)
  - `name?`: string - Nama publisher
  - `description?`: string - Deskripsi publisher
  - `website?`: string - Website publisher
  - `address?`: string - Alamat publisher
  - `logo?`: string - Logo publisher

#### 5. Publisher Delete (`publisher-delete.ts`)
- **URL**: `/api/internal/publisher/delete`
- **Purpose**: Menghapus publisher
- **Parameters**:
  - `id`: string - ID publisher (wajib)
  - `hard_delete?`: boolean - Hapus permanen (default: false)

#### 6. Publisher Search (`publisher-search.ts`)
- **URL**: `/api/internal/publisher/search`
- **Purpose**: Pencarian publisher dengan filter lanjutan
- **Parameters**:
  - `query?`: string - Teks pencarian
  - `has_books?`: boolean - Filter berdasarkan kepemilikan buku
  - `sort_by?`: string - Kolom sorting
  - `sort_order?`: "asc" | "desc" - Urutan sorting

#### 7. Publisher Stats (`publisher-stats.ts`)
- **URL**: `/api/internal/publisher/stats`
- **Purpose**: Mendapatkan statistik publisher
- **Parameters**:
  - `id?`: string - ID publisher spesifik
  - `date_from?`: string - Tanggal mulai
  - `date_to?`: string - Tanggal akhir

### Internal User Management

#### 1. Internal Create (`internal-create.ts`)
- **URL**: `/api/internal/internal/create`
- **Purpose**: Membuat user internal baru
- **Parameters**:
  - `name`: string - Nama user (wajib)
  - `email`: string - Email user (wajib)
  - `role`: string - Role user (wajib)
  - `id_account?`: string - ID akun terkait
  - `id_user?`: string - ID user terkait

#### 2. Internal List (`internal-list.ts`)
- **URL**: `/api/internal/internal/list`
- **Purpose**: Mendapatkan daftar user internal
- **Parameters**:
  - `page?`: number - Halaman untuk pagination
  - `limit?`: number - Jumlah data per halaman
  - `search?`: string - Pencarian berdasarkan nama atau email
  - `role?`: string - Filter berdasarkan role

#### 3. Internal Get (`internal-get.ts`)
- **URL**: `/api/internal/internal/get`
- **Purpose**: Mendapatkan detail user internal
- **Parameters**:
  - `id`: string - ID user internal (wajib)

#### 4. Internal Update (`internal-update.ts`)
- **URL**: `/api/internal/internal/update`
- **Purpose**: Memperbarui data user internal
- **Parameters**:
  - `id`: string - ID user internal (wajib)
  - `name?`: string - Nama user
  - `email?`: string - Email user
  - `role?`: string - Role user

#### 5. Internal Delete (`internal-delete.ts`)
- **URL**: `/api/internal/internal/delete`
- **Purpose**: Menghapus user internal
- **Parameters**:
  - `id`: string - ID user internal (wajib)
  - `hard_delete?`: boolean - Hapus permanen (default: false)

#### 6. Internal Search (`internal-search.ts`)
- **URL**: `/api/internal/internal/search`
- **Purpose**: Pencarian user internal dengan filter lanjutan
- **Parameters**:
  - `query?`: string - Teks pencarian
  - `role?`: string[] - Filter berdasarkan role
  - `active_only?`: boolean - Hanya user aktif
  - `sort_by?`: string - Kolom sorting
  - `sort_order?`: "asc" | "desc" - Urutan sorting

#### 7. Internal Stats (`internal-stats.ts`)
- **URL**: `/api/internal/internal/stats`
- **Purpose**: Mendapatkan statistik user internal
- **Parameters**:
  - `id?`: string - ID user internal spesifik
  - `role?`: string - Filter berdasarkan role
  - `date_from?`: string - Tanggal mulai
  - `date_to?`: string - Tanggal akhir

### Dashboard & Analytics

#### 1. Dashboard Stats (`dashboard-stats.ts`)
- **URL**: `/api/internal/dashboard/stats`
- **Purpose**: Mendapatkan statistik dashboard untuk panel admin
- **Parameters**:
  - `period?`: string - Periode statistik dalam hari (default: "30")

### Other Internal APIs

#### 1. Book Approval Create (`book-approval-create.ts`)
- **URL**: `/api/internal/book/approval/create`
- **Purpose**: Membuat approval untuk buku
- **Parameters**:
  - `id_book`: string - ID buku (wajib)
  - `status`: string - Status approval (wajib)
  - `notes?`: string - Catatan approval
  - `reviewer_id`: string - ID reviewer (wajib)

#### 2. Check (`check.ts`)
- **URL**: `/api/internal/check`
- **Purpose**: Health check untuk internal sistem
- **Parameters**: Tidak ada

---

## Publishing APIs

### Bundle Management

#### 1. Bundle List (`bundle-list.ts`)
- **URL**: `/api/publish/bundle/list`
- **Purpose**: Mendapatkan daftar bundle dengan pagination dan filter
- **Parameters**:
  - `user`: Partial<User> - Data user (wajib)
  - `page?`: number - Halaman untuk pagination (default: 1)
  - `limit?`: number - Jumlah data per halaman (default: 10)
  - `status?`: string - Filter berdasarkan status bundle
  - `search?`: string - Pencarian berdasarkan nama, slug, atau deskripsi
  - `include_categories?`: boolean - Sertakan data kategori
  - `include_products?`: boolean - Sertakan data produk

#### 2. Bundle Create (`bundle-create.ts`)
- **URL**: `/api/publish/bundle/create`
- **Purpose**: Membuat bundle baru dengan produk dan kategori
- **Parameters**:
  - `user`: Partial<User> - Data user (wajib)
  - `name`: string - Nama bundle (wajib)
  - `slug`: string - Slug bundle (wajib, unik)
  - `strike_price?`: number - Harga coret
  - `real_price`: number - Harga sebenarnya (wajib)
  - `currency?`: string - Mata uang (default: "Rp.")
  - `desc?`: string - Deskripsi bundle
  - `info?`: Record<string, any> - Informasi tambahan
  - `status?`: string - Status bundle (default: "draft")
  - `img_file?`: string - File gambar
  - `cover?`: string - Cover bundle
  - `sku?`: string - SKU bundle
  - `cfg?`: Record<string, any> - Konfigurasi tambahan
  - `categories?`: string[] - Array ID kategori
  - `products?`: Array<{id_product: string, qty?: number}> - Array produk

#### 3. Bundle Get (`bundle-get.ts`)
- **URL**: `/api/publish/bundle/get`
- **Purpose**: Mendapatkan detail bundle berdasarkan ID atau slug
- **Parameters**:
  - `user`: Partial<User> - Data user (wajib)
  - `id?`: string - ID bundle
  - `slug?`: string - Slug bundle
  - `include_categories?`: boolean - Sertakan data kategori (default: true)
  - `include_products?`: boolean - Sertakan data produk (default: true)
  - `include_sales?`: boolean - Sertakan data penjualan (default: false)

#### 4. Bundle Update (`bundle-update.ts`)
- **URL**: `/api/publish/bundle/update`
- **Purpose**: Memperbarui data bundle
- **Parameters**:
  - `user`: Partial<User> - Data user (wajib)
  - `id`: string - ID bundle (wajib)
  - `name?`: string - Nama bundle
  - `slug?`: string - Slug bundle
  - `strike_price?`: number - Harga coret
  - `real_price?`: number - Harga sebenarnya
  - `currency?`: string - Mata uang
  - `desc?`: string - Deskripsi bundle
  - `info?`: Record<string, any> - Informasi tambahan
  - `status?`: string - Status bundle
  - `img_file?`: string - File gambar
  - `cover?`: string - Cover bundle
  - `sku?`: string - SKU bundle
  - `cfg?`: Record<string, any> - Konfigurasi tambahan
  - `categories?`: string[] - Array ID kategori
  - `products?`: Array<{id_product: string, qty?: number}> - Array produk

#### 5. Bundle Delete (`bundle-delete.ts`)
- **URL**: `/api/publish/bundle/delete`
- **Purpose**: Menghapus bundle (soft delete atau hard delete)
- **Parameters**:
  - `user`: Partial<User> - Data user (wajib)
  - `id`: string - ID bundle (wajib)
  - `hard_delete?`: boolean - Hapus permanen (default: false)

#### 6. Bundle Stats (`bundle-stats.ts`)
- **URL**: `/api/publish/bundle/stats`
- **Purpose**: Mendapatkan statistik bundle
- **Parameters**:
  - `user`: Partial<User> - Data user (wajib)
  - `id?`: string - ID bundle spesifik
  - `date_from?`: string - Tanggal mulai untuk filter penjualan
  - `date_to?`: string - Tanggal akhir untuk filter penjualan

#### 7. Bundle Product Manage (`bundle-product-manage.ts`)
- **URL**: `/api/publish/bundle/product/manage`
- **Purpose**: Mengelola produk dalam bundle
- **Parameters**:
  - `user`: Partial<User> - Data user (wajib)
  - `id_bundle`: string - ID bundle (wajib)
  - `action`: "add" | "remove" | "update" | "replace" - Aksi yang dilakukan
  - `products`: Array<{id_product: string, qty?: number}> - Array produk

#### 8. Bundle Category Manage (`bundle-category-manage.ts`)
- **URL**: `/api/publish/bundle/category/manage`
- **Purpose**: Mengelola kategori dalam bundle
- **Parameters**:
  - `user`: Partial<User> - Data user (wajib)
  - `id_bundle`: string - ID bundle (wajib)
  - `action`: "add" | "remove" | "replace" - Aksi yang dilakukan
  - `categories`: string[] - Array ID kategori

#### 9. Bundle Search (`bundle-search.ts`)
- **URL**: `/api/publish/bundle/search`
- **Purpose**: Pencarian bundle dengan filter lanjutan
- **Parameters**:
  - `user`: Partial<User> - Data user (wajib)
  - `query?`: string - Teks pencarian
  - `status?`: string[] - Filter berdasarkan status
  - `price_min?`: number - Harga minimum
  - `price_max?`: number - Harga maksimum
  - `has_products?`: boolean - Filter berdasarkan kepemilikan produk
  - `has_categories?`: boolean - Filter berdasarkan kepemilikan kategori
  - `category_ids?`: string[] - Filter berdasarkan ID kategori
  - `product_ids?`: string[] - Filter berdasarkan ID produk
  - `sort_by?`: "name" | "price" | "created_at" | "sales" - Kolom sorting
  - `sort_order?`: "asc" | "desc" - Urutan sorting
  - `page?`: number - Halaman untuk pagination
  - `limit?`: number - Jumlah data per halaman

### Book Management

#### 1. Book Create (`book-create.ts`)
- **URL**: `/api/publish/book/create`
- **Purpose**: Membuat buku baru
- **Parameters**:
  - `data`: Partial<Book> - Data buku yang akan dibuat (wajib)

#### 2. Book List (`book-list.ts`)
- **URL**: `/api/publish/book/list`
- **Purpose**: Mendapatkan daftar buku
- **Parameters**:
  - `user`: Partial<User> - Data user (wajib)
  - `page?`: number - Halaman untuk pagination
  - `limit?`: number - Jumlah data per halaman
  - `status?`: string - Filter berdasarkan status
  - `search?`: string - Pencarian berdasarkan judul atau deskripsi
  - `author_id?`: string - Filter berdasarkan author

#### 3. Book Detail (`book-detail.ts`)
- **URL**: `/api/publish/book/detail`
- **Purpose**: Mendapatkan detail buku
- **Parameters**:
  - `id`: string - ID buku (wajib)
  - `include_chapters?`: boolean - Sertakan daftar chapter
  - `include_author?`: boolean - Sertakan data author

#### 4. Book Update (`book-update.ts`)
- **URL**: `/api/publish/book/update`
- **Purpose**: Memperbarui data buku
- **Parameters**:
  - `id`: string - ID buku (wajib)
  - `data`: Partial<Book> - Data buku yang akan diperbarui

#### 5. Book Delete (`book-delete.ts`)
- **URL**: `/api/publish/book/delete`
- **Purpose**: Menghapus buku
- **Parameters**:
  - `id`: string - ID buku (wajib)
  - `hard_delete?`: boolean - Hapus permanen (default: false)

#### 6. Book Approval List (`book-approval-list.ts`)
- **URL**: `/api/publish/book/approval/list`
- **Purpose**: Mendapatkan daftar approval buku
- **Parameters**:
  - `page?`: number - Halaman untuk pagination
  - `limit?`: number - Jumlah data per halaman
  - `status?`: string - Filter berdasarkan status approval
  - `book_id?`: string - Filter berdasarkan ID buku

#### 7. Book Changes Log List (`book-changes-log-list.ts`)
- **URL**: `/api/publish/book/changes/log/list`
- **Purpose**: Mendapatkan log perubahan buku
- **Parameters**:
  - `book_id`: string - ID buku (wajib)
  - `page?`: number - Halaman untuk pagination
  - `limit?`: number - Jumlah data per halaman

### Product Management

#### 1. Product Create (`product-create.ts`)
- **URL**: `/api/publish/product/create`
- **Purpose**: Membuat produk baru
- **Parameters**:
  - `user`: Partial<User> - Data user (wajib)
  - `name`: string - Nama produk (wajib)
  - `slug`: string - Slug produk (wajib, unik)
  - `price`: number - Harga produk (wajib)
  - `desc?`: string - Deskripsi produk
  - `status?`: string - Status produk
  - `img_file?`: string - File gambar produk
  - `cfg?`: Record<string, any> - Konfigurasi tambahan

#### 2. Product List (`product-list.ts`)
- **URL**: `/api/publish/product/list`
- **Purpose**: Mendapatkan daftar produk
- **Parameters**:
  - `user`: Partial<User> - Data user (wajib)
  - `page?`: number - Halaman untuk pagination
  - `limit?`: number - Jumlah data per halaman
  - `status?`: string - Filter berdasarkan status
  - `search?`: string - Pencarian berdasarkan nama atau deskripsi

#### 3. Product Detail (`product-detail.ts`)
- **URL**: `/api/publish/product/detail`
- **Purpose**: Mendapatkan detail produk
- **Parameters**:
  - `user`: Partial<User> - Data user (wajib)
  - `id?`: string - ID produk
  - `slug?`: string - Slug produk
  - `include_sales?`: boolean - Sertakan data penjualan

#### 4. Product Update (`product-update.ts`)
- **URL**: `/api/publish/product/update`
- **Purpose**: Memperbarui data produk
- **Parameters**:
  - `user`: Partial<User> - Data user (wajib)
  - `id`: string - ID produk (wajib)
  - `name?`: string - Nama produk
  - `slug?`: string - Slug produk
  - `price?`: number - Harga produk
  - `desc?`: string - Deskripsi produk
  - `status?`: string - Status produk
  - `img_file?`: string - File gambar produk
  - `cfg?`: Record<string, any> - Konfigurasi tambahan

#### 5. Product Delete (`product-delete.ts`)
- **URL**: `/api/publish/product/delete`
- **Purpose**: Menghapus produk
- **Parameters**:
  - `user`: Partial<User> - Data user (wajib)
  - `id`: string - ID produk (wajib)
  - `hard_delete?`: boolean - Hapus permanen (default: false)

#### 6. Product Stats (`product-stats.ts`)
- **URL**: `/api/publish/product/stats`
- **Purpose**: Mendapatkan statistik produk
- **Parameters**:
  - `user`: Partial<User> - Data user (wajib)
  - `id?`: string - ID produk spesifik
  - `date_from?`: string - Tanggal mulai
  - `date_to?`: string - Tanggal akhir

### Chapter Management

#### 1. Chapter Create (`chapter-create.ts`)
- **URL**: `/api/publish/chapter/create`
- **Purpose**: Membuat chapter baru
- **Parameters**:
  - `book_id`: string - ID buku (wajib)
  - `title`: string - Judul chapter (wajib)
  - `content`: string - Konten chapter (wajib)
  - `order?`: number - Urutan chapter
  - `is_published?`: boolean - Status publikasi

#### 2. Chapter Creates (`chapter-creates.ts`)
- **URL**: `/api/publish/chapter/creates`
- **Purpose**: Membuat multiple chapter sekaligus
- **Parameters**:
  - `book_id`: string - ID buku (wajib)
  - `chapters`: Array<{title: string, content: string, order?: number}> - Array chapter

#### 3. Chapter List (`chapter-list.ts`)
- **URL**: `/api/publish/chapter/list`
- **Purpose**: Mendapatkan daftar chapter
- **Parameters**:
  - `book_id`: string - ID buku (wajib)
  - `page?`: number - Halaman untuk pagination
  - `limit?`: number - Jumlah data per halaman
  - `include_content?`: boolean - Sertakan konten chapter

#### 4. Chapter Update (`chapter-update.ts`)
- **URL**: `/api/publish/chapter/update`
- **Purpose**: Memperbarui chapter
- **Parameters**:
  - `id`: string - ID chapter (wajib)
  - `title?`: string - Judul chapter
  - `content?`: string - Konten chapter
  - `order?`: number - Urutan chapter
  - `is_published?`: boolean - Status publikasi

#### 5. Chapter Updates (`chapter-updates.ts`)
- **URL**: `/api/publish/chapter/updates`
- **Purpose**: Memperbarui multiple chapter sekaligus
- **Parameters**:
  - `chapters`: Array<{id: string, data: Partial<Chapter>}> - Array chapter yang akan diperbarui

#### 6. Chapter Deletes (`chapter-deletes.ts`)
- **URL**: `/api/publish/chapter/deletes`
- **Purpose**: Menghapus multiple chapter sekaligus
- **Parameters**:
  - `ids`: string[] - Array ID chapter yang akan dihapus

### Author & Publisher Management

#### 1. Author Detail (`author-detail.ts`)
- **URL**: `/api/publish/author/detail`
- **Purpose**: Mendapatkan detail author dalam konteks publishing
- **Parameters**:
  - `id`: string - ID author (wajib)
  - `include_books?`: boolean - Sertakan daftar buku

#### 2. Author Update (`author-update.ts`)
- **URL**: `/api/publish/author/update`
- **Purpose**: Memperbarui data author dalam konteks publishing
- **Parameters**:
  - `id`: string - ID author (wajib)
  - `data`: Partial<Author> - Data author yang akan diperbarui

#### 3. Publisher Detail (`publisher-detail.ts`)
- **URL**: `/api/publish/publisher/detail`
- **Purpose**: Mendapatkan detail publisher
- **Parameters**:
  - `id`: string - ID publisher (wajib)

#### 4. Publisher Authors Create (`publisher-authors-create.ts`)
- **URL**: `/api/publish/publisher/authors/create`
- **Purpose**: Menambah author ke publisher
- **Parameters**:
  - `publisher_id`: string - ID publisher (wajib)
  - `author_id`: string - ID author (wajib)
  - `role?`: string - Role author dalam publisher

#### 5. Publisher Authors List (`publisher-authors-list.ts`)
- **URL**: `/api/publish/publisher/authors/list`
- **Purpose**: Mendapatkan daftar author dalam publisher
- **Parameters**:
  - `publisher_id`: string - ID publisher (wajib)
  - `page?`: number - Halaman untuk pagination
  - `limit?`: number - Jumlah data per halaman

#### 6. Publisher Authors Delete (`publisher-authors-delete.ts`)
- **URL**: `/api/publish/publisher/authors/delete`
- **Purpose**: Menghapus author dari publisher
- **Parameters**:
  - `publisher_id`: string - ID publisher (wajib)
  - `author_id`: string - ID author (wajib)

### Sales & Transaction Management

#### 1. Sales Line List (`t-sales-line-list.ts`)
- **URL**: `/api/publish/sales/line/list`
- **Purpose**: Mendapatkan daftar line penjualan
- **Parameters**:
  - `user`: Partial<User> - Data user (wajib)
  - `page?`: number - Halaman untuk pagination
  - `limit?`: number - Jumlah data per halaman
  - `date_from?`: string - Tanggal mulai
  - `date_to?`: string - Tanggal akhir
  - `product_id?`: string - Filter berdasarkan produk
  - `bundle_id?`: string - Filter berdasarkan bundle

#### 2. Transactions (`transactions.ts`)
- **URL**: `/api/publish/transactions`
- **Purpose**: Mendapatkan daftar transaksi
- **Parameters**:
  - `user`: Partial<User> - Data user (wajib)
  - `page?`: number - Halaman untuk pagination
  - `limit?`: number - Jumlah data per halaman
  - `status?`: string - Filter berdasarkan status
  - `date_from?`: string - Tanggal mulai
  - `date_to?`: string - Tanggal akhir

#### 3. Withdrawal (`withdrawal.ts`)
- **URL**: `/api/publish/withdrawal`
- **Purpose**: Melakukan penarikan dana
- **Parameters**:
  - `user`: Partial<User> - Data user (wajib)
  - `amount`: number - Jumlah penarikan (wajib)
  - `bank_account`: string - Rekening tujuan (wajib)
  - `notes?`: string - Catatan penarikan

### Other Publishing APIs

#### 1. Check Author (`check-author.ts`)
- **URL**: `/api/publish/check/author`
- **Purpose**: Mengecek status author untuk publishing
- **Parameters**:
  - `user`: Partial<User> - Data user (wajib)

#### 2. Onboarding (`onboarding.ts`)
- **URL**: `/api/publish/onboarding`
- **Purpose**: Proses onboarding untuk publisher baru
- **Parameters**:
  - `user`: Partial<User> - Data user (wajib)
  - `step`: string - Step onboarding (wajib)
  - `data`: Record<string, any> - Data onboarding

#### 3. Register User (`register-user.ts`)
- **URL**: `/api/publish/register/user`
- **Purpose**: Registrasi user baru untuk publishing
- **Parameters**:
  - `email`: string - Email user (wajib)
  - `password`: string - Password user (wajib)
  - `name`: string - Nama user (wajib)
  - `role?`: string - Role user

---

## Chapter APIs

### 1. Author (`author.tsx`)
- **URL**: `/api/chapter/author`
- **Purpose**: Halaman detail author dengan daftar karya
- **Parameters**:
  - `id`: string - ID author (wajib)

### 2. Browse (`browse.tsx`)
- **URL**: `/api/chapter/browse`
- **Purpose**: Halaman browse untuk menjelajahi buku dan chapter
- **Parameters**:
  - `category?`: string - Filter kategori
  - `genre?`: string - Filter genre
  - `sort?`: string - Sorting option

### 3. Chapter (`chapter.tsx`)
- **URL**: `/api/chapter/chapter`
- **Purpose**: Halaman detail chapter untuk membaca
- **Parameters**:
  - `id`: string - ID chapter (wajib)
  - `book_id`: string - ID buku (wajib)

### 4. Genre (`genre.tsx`)
- **URL**: `/api/chapter/genre`
- **Purpose**: Halaman daftar genre
- **Parameters**:
  - `id?`: string - ID genre spesifik

### 5. Index (`index.tsx`)
- **URL**: `/api/chapter/`
- **Purpose**: Halaman utama chapter/reading
- **Parameters**: Tidak ada

### 6. Library (`library.tsx`)
- **URL**: `/api/chapter/library`
- **Purpose**: Halaman library user
- **Parameters**:
  - `user_id`: string - ID user (wajib)

### 7. Rankings (`rankings.tsx`)
- **URL**: `/api/chapter/rankings`
- **Purpose**: Halaman ranking buku populer
- **Parameters**:
  - `period?`: string - Periode ranking (daily, weekly, monthly)
  - `category?`: string - Filter kategori

### 8. Search (`search.tsx`)
- **URL**: `/api/chapter/search`
- **Purpose**: Halaman pencarian buku dan chapter
- **Parameters**:
  - `q`: string - Query pencarian (wajib)
  - `type?`: string - Tipe pencarian (book, author, chapter)

### 9. Tags (`tags.tsx`)
- **URL**: `/api/chapter/tags`
- **Purpose**: Halaman daftar tag
- **Parameters**:
  - `tag?`: string - Tag spesifik

### 10. Title (`title.tsx`)
- **URL**: `/api/chapter/title`
- **Purpose**: Halaman detail buku/title
- **Parameters**:
  - `id`: string - ID buku (wajib)

---

## Main Application APIs

### 1. About (`about.tsx`)
- **URL**: `/api/main/about`
- **Purpose**: Halaman tentang aplikasi
- **Parameters**: Tidak ada

### 2. Browse (`browse.tsx`)
- **URL**: `/api/main/browse`
- **Purpose**: Halaman browse produk dan bundle
- **Parameters**:
  - `category?`: string - Filter kategori
  - `price_min?`: number - Harga minimum
  - `price_max?`: number - Harga maksimum

### 3. Bundle (`bundle.tsx`)
- **URL**: `/api/main/bundle`
- **Purpose**: Halaman detail bundle
- **Parameters**:
  - `id?`: string - ID bundle
  - `slug?`: string - Slug bundle

### 4. Bundles (`bundles.tsx`)
- **URL**: `/api/main/bundles`
- **Purpose**: Halaman daftar bundle
- **Parameters**:
  - `page?`: number - Halaman untuk pagination
  - `category?`: string - Filter kategori

### 5. Cart (`cart.tsx`)
- **URL**: `/api/main/cart`
- **Purpose**: Halaman keranjang belanja
- **Parameters**:
  - `user_id`: string - ID user (wajib)

### 6. Category (`category.tsx`)
- **URL**: `/api/main/category`
- **Purpose**: Halaman produk berdasarkan kategori
- **Parameters**:
  - `id`: string - ID kategori (wajib)

### 7. Checkout (`checkout.tsx`)
- **URL**: `/api/main/checkout`
- **Purpose**: Halaman checkout pembelian
- **Parameters**:
  - `user_id`: string - ID user (wajib)
  - `items`: string - JSON string items yang dibeli

### 8. Contact (`contact.tsx`)
- **URL**: `/api/main/contact`
- **Purpose**: Halaman kontak
- **Parameters**: Tidak ada

### 9. Esensi (`esensi.tsx`)
- **URL**: `/api/main/esensi`
- **Purpose**: Halaman utama esensi
- **Parameters**: Tidak ada

### 10. History (`history.tsx`)
- **URL**: `/api/main/history`
- **Purpose**: Halaman riwayat pembelian
- **Parameters**:
  - `user_id`: string - ID user (wajib)

### 11. Index (`index.tsx`)
- **URL**: `/api/main/`
- **Purpose**: Halaman utama aplikasi
- **Parameters**: Tidak ada

### 12. Index Old (`index-old.tsx`)
- **URL**: `/api/main/old`
- **Purpose**: Halaman utama aplikasi versi lama (deprecated)
- **Parameters**: Tidak ada

### 13. Library (`library.tsx`)
- **URL**: `/api/main/library`
- **Purpose**: Halaman library user
- **Parameters**:
  - `user_id`: string - ID user (wajib)

### 14. Login (`login.tsx`)
- **URL**: `/api/main/login`
- **Purpose**: Halaman login
- **Parameters**: Tidak ada

### 15. OTP (`otp.tsx`)
- **URL**: `/api/main/otp`
- **Purpose**: Halaman verifikasi OTP
- **Parameters**:
  - `phone`: string - Nomor telepon (wajib)

### 16. Product (`product.tsx`)
- **URL**: `/api/main/product`
- **Purpose**: Halaman detail produk
- **Parameters**:
  - `id?`: string - ID produk
  - `slug?`: string - Slug produk

### 17. Profile (`profile.tsx`)
- **URL**: `/api/main/profile`
- **Purpose**: Halaman profil user
- **Parameters**:
  - `user_id`: string - ID user (wajib)

### 18. Profile Edit (`profile-edit.tsx`)
- **URL**: `/api/main/profile/edit`
- **Purpose**: Halaman edit profil
- **Parameters**:
  - `user_id`: string - ID user (wajib)

### 19. Read (`read.tsx`)
- **URL**: `/api/main/read`
- **Purpose**: Halaman membaca buku/chapter
- **Parameters**:
  - `id`: string - ID buku atau chapter (wajib)
  - `chapter_id?`: string - ID chapter spesifik

### 20. Reset Password (`resetpass.tsx`)
- **URL**: `/api/main/resetpass`
- **Purpose**: Halaman reset password
- **Parameters**:
  - `token`: string - Token reset (wajib)

### 21. Search (`search.tsx`)
- **URL**: `/api/main/search`
- **Purpose**: Halaman pencarian produk dan bundle
- **Parameters**:
  - `q`: string - Query pencarian (wajib)
  - `type?`: string - Tipe pencarian

### 22. Terbitan (`terbitan.tsx`)
- **URL**: `/api/main/terbitan`
- **Purpose**: Halaman terbitan/publikasi
- **Parameters**: Tidak ada

### 23. Transaction (`trx.tsx`)
- **URL**: `/api/main/trx`
- **Purpose**: Halaman detail transaksi
- **Parameters**:
  - `id`: string - ID transaksi (wajib)

---

## File & Upload APIs

### 1. Files (`files.ts`)
- **URL**: `/api/files`
- **Purpose**: Mengelola file dalam sistem
- **Parameters**:
  - `action`: "list" | "get" | "delete" - Aksi yang dilakukan
  - `path?`: string - Path file (untuk get dan delete)
  - `folder?`: string - Folder untuk list

### 2. Upload (`upload.ts`)
- **URL**: `/api/upload`
- **Purpose**: Upload file ke sistem
- **Parameters**:
  - `file`: File - File yang akan diupload (wajib)
  - `folder?`: string - Folder tujuan upload
  - `filename?`: string - Nama file kustom

### 3. Get Session (`get-session.ts`)
- **URL**: `/api/get-session`
- **Purpose**: Mendapatkan session user saat ini
- **Parameters**: Tidak ada

---

## General Usage

### Frontend Usage Example

```typescript
import { api } from "@/lib/gen/auth.esensi";
import { api as publishApi } from "@/lib/gen/publish.esensi";
import { api as internalApi } from "@/lib/gen/internal.esensi";

// Authentication
const user = await api.auth_user({ username: "john@example.com" });

// Publishing
const books = await publishApi.book_list({
  user: currentUser,
  page: 1,
  limit: 10,
  status: "published"
});

// Create new bundle
const newBundle = await publishApi.bundle_create({
  user: currentUser,
  name: "Bundle Programming",
  slug: "bundle-programming", 
  real_price: 150000,
  products: [
    { id_product: "prod-1", qty: 1 },
    { id_product: "prod-2", qty: 1 }
  ]
});

// Internal management
const authors = await internalApi.author_list({
  page: 1,
  limit: 20,
  search: "john"
});

// Affiliate management
const affiliates = await internalApi.affiliate_list({
  page: 1,
  limit: 10
});

// Create new affiliate
const newAffiliate = await internalApi.affiliate_create({
  name: "Affiliate ABC",
  id_user: "user-123"
});

// Customer management
const customers = await internalApi.customer_list({
  page: 1,
  limit: 10,
  search: "john"
});

// Publisher management
const publishers = await internalApi.publisher_list({
  page: 1,
  limit: 10
});

// Dashboard statistics
const dashboardStats = await internalApi.dashboard_stats({
  period: "30"
});
```

---

## Error Handling

Semua API mengembalikan response dengan format standar:

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: {
    code: string;
    details?: any;
  };
}
```

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Data berhasil diambil"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Data tidak ditemukan",
  "error": {
    "code": "NOT_FOUND",
    "details": "User dengan ID tersebut tidak ditemukan"
  }
}
```

### Pagination Response
```json
{
  "success": true,
  "data": [...],
  "message": "Data berhasil diambil",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

---

## Security Notes

### Authentication
- Sebagian besar API memerlukan parameter `user` untuk authentikasi
- Session divalidasi melalui better-auth
- Role-based access control untuk API internal dan publishing

### Authorization
- User hanya dapat mengakses data yang mereka miliki
- Publisher hanya dapat mengelola buku dan produk mereka sendiri
- Admin memiliki akses ke semua data melalui internal APIs

### Data Protection
- Soft delete digunakan untuk menjaga integritas referensial
- Hard delete hanya untuk data yang tidak memiliki relasi
- Validation ketat untuk input yang mempengaruhi business logic

### Rate Limiting
- Upload file dibatasi ukuran dan tipe
- API search memiliki throttling untuk mencegah abuse
- Session timeout otomatis untuk keamanan

---

## Performance Considerations

### Database Optimization
- Index pada kolom yang sering digunakan untuk filter dan search
- Pagination wajib untuk endpoint yang mengembalikan list data
- Include relations hanya jika diperlukan

### Caching Strategy
- Response API di-cache berdasarkan parameter
- Static assets menggunakan CDN
- Database query optimization dengan proper indexing

### Background Processing
- Upload file besar menggunakan background job
- Email notification dikirim secara asynchronous
- Report generation dilakukan di background

### Monitoring
- API response time monitoring
- Error tracking dan alerting
- Resource usage monitoring untuk database dan server

---

## Changelog

### Version 1.2.0 (Current)
- Added Affiliate Management APIs (create, list, get, update, delete, search, stats)
- Added Customer Management APIs (create, list, get, update, delete, search, stats)
- Added Publisher Management APIs (create, list, get, update, delete, search, stats) 
- Added Internal User Management APIs (create, list, get, update, delete, search, stats)
- Added Dashboard Stats API for admin analytics
- Enhanced API documentation with comprehensive parameter details
- Added usage examples for new API endpoints

### Version 1.0.0
- Initial API documentation
- Basic CRUD operations untuk semua entitas
- Authentication dan authorization system
- File upload dan management

### Version 1.1.0 (Planned)
- Advanced search dengan Elasticsearch
- Real-time notifications dengan WebSocket
- API versioning support
- Enhanced security dengan 2FA

---

*Dokumentasi ini akan terus diperbarui seiring dengan pengembangan sistem.*
