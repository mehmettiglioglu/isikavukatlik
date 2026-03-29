# Işık Hukuk Bürosu — Kurulum Rehberi

## Proje Yapısı

```
isikavukatlik/
├── backend/
│   └── IsikAvukatlik.API/       .NET 9 Web API
└── frontend/                    Next.js 15 App Router
```

---

## 1. Backend Kurulumu (.NET 9)

### Gereksinimler
- .NET 9 SDK
- PostgreSQL (uzak sunucu veya yerel)

### Adımlar

```bash
cd backend/IsikAvukatlik.API

# NuGet paketlerini yükle
dotnet restore

# appsettings.json içindeki bağlantı bilgilerini güncelle:
# Host=, Username=, Password= alanlarını doldurun
# JWT Key'i rastgele güvenli bir değerle değiştirin

# Migration oluştur (ilk kez)
dotnet ef migrations add InitialCreate --output-dir Data/Migrations

# Veritabanını oluştur ve seed et
dotnet ef database update

# Geliştirme modunda çalıştır
dotnet run
# API: http://localhost:5000
# Swagger: http://localhost:5000/swagger
```

### İlk Admin Kullanıcısı Oluşturma

Program.cs içindeki MigrateAsync bloğuna ekleyin veya seed script çalıştırın:

```csharp
// Geçici olarak Program.cs'e ekleyip sonra kaldırın
var userService = scope.ServiceProvider.GetRequiredService<AppDbContext>();
if (!await userService.Users.AnyAsync())
{
    userService.Users.Add(new User {
        Username = "admin",
        PasswordHash = BCrypt.Net.BCrypt.HashPassword("GüçlüŞifre123!"),
        Role = "Admin"
    });
    await userService.SaveChangesAsync();
}
```

---

## 2. Frontend Kurulumu (Next.js 15)

### Gereksinimler
- Node.js 20+

### Adımlar

```bash
cd frontend

# Bağımlılıkları yükle
npm install

# .env.local dosyasını yapılandır
# NEXT_PUBLIC_API_URL=http://localhost:5000/api   (backend adresi)
# NEXT_PUBLIC_SITE_URL=https://isikavukatlik.com

# Geliştirme modunda çalıştır
npm run dev
# Site: http://localhost:3000
```

---

## 3. Üretim (Production) Ortamı

### Backend
```bash
dotnet publish -c Release -o ./publish
# Kestrel veya IIS ile çalıştırın
# Reverse proxy için Nginx/Caddy önerilir
```

### Frontend (Vercel veya kendi sunucu)
```bash
npm run build
npm start
# veya
# Vercel: git push → otomatik deploy
```

---

## 4. Ortam Değişkenleri

### Backend — appsettings.json
| Alan | Açıklama |
|------|----------|
| `ConnectionStrings:DefaultConnection` | PostgreSQL bağlantı string'i |
| `Jwt:Key` | En az 32 karakter, rastgele güvenli string |
| `Jwt:Issuer` | API adı (değiştirmeyebilirsiniz) |
| `Jwt:Audience` | Frontend adı |
| `AllowedOrigins:Prod` | Canlı site URL'si |

### Frontend — .env.local
| Değişken | Açıklama |
|----------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API adresi |
| `NEXT_PUBLIC_SITE_URL` | Site URL'si (canonical için) |
| `NEXT_PUBLIC_SITE_NAME` | Site adı (metadata için) |

---

## 5. API Endpoint Özeti

| Method | Endpoint | Yetki | Açıklama |
|--------|----------|-------|----------|
| POST | `/api/auth/login` | Herkese açık | Admin girişi |
| GET | `/api/articles` | Herkese açık | Yayınlanmış makaleler |
| GET | `/api/articles/{slug}` | Herkese açık | Makale detayı |
| GET | `/api/categories` | Herkese açık | Kategoriler |
| GET | `/api/articles/admin/all` | Admin JWT | Tüm makaleler |
| POST | `/api/articles` | Admin JWT | Makale ekle |
| PUT | `/api/articles/{id}` | Admin JWT | Makale güncelle |
| DELETE | `/api/articles/{id}` | Admin JWT | Makale sil |
