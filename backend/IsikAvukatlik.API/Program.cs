using System.Text;
using IsikAvukatlik.API.Data;
using IsikAvukatlik.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// --- PostgreSQL / EF Core ---
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// --- JWT ---
var jwtSettings = builder.Configuration.GetSection("Jwt");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSettings["Key"]!))
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddScoped<TokenService>();

// --- CORS (Frontend dev/prod) ---
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy
            .WithOrigins(
                builder.Configuration["AllowedOrigins:Dev"] ?? "http://localhost:3000",
                builder.Configuration["AllowedOrigins:Prod"] ?? "https://isikavukatlik.com"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Işık Avukatlık API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "JWT Token: Bearer {token}",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// --- Otomatik Migration / Tablo Oluşturma ---
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    // Migration dosyası yoksa EnsureCreated ile tüm tablolar oluşturulur
    await db.Database.EnsureCreatedAsync();

    // ContactMessages tablosu yoksa manuel oluştur (schema güncellemeleri için)
    await db.Database.ExecuteSqlRawAsync("""
        CREATE TABLE IF NOT EXISTS "ContactMessages" (
            "Id" SERIAL PRIMARY KEY,
            "Name" TEXT NOT NULL DEFAULT '',
            "Email" TEXT NOT NULL DEFAULT '',
            "Phone" TEXT NULL,
            "Subject" TEXT NOT NULL DEFAULT '',
            "Message" TEXT NOT NULL DEFAULT '',
            "CreatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            "IsRead" BOOLEAN NOT NULL DEFAULT FALSE
        );
    """);

    // LegalTerms tablosu yoksa oluştur
    await db.Database.ExecuteSqlRawAsync("""
        CREATE TABLE IF NOT EXISTS "LegalTerms" (
            "Id" SERIAL PRIMARY KEY,
            "Title" VARCHAR(300) NOT NULL DEFAULT '',
            "Slug" VARCHAR(350) NOT NULL DEFAULT '',
            "Letter" VARCHAR(1) NOT NULL DEFAULT '',
            "Category" VARCHAR(200) NOT NULL DEFAULT '',
            "Definition" TEXT NOT NULL DEFAULT '',
            "ShortDescription" VARCHAR(500) NULL,
            "IsPublished" BOOLEAN NOT NULL DEFAULT TRUE,
            "CreatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            "UpdatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "IX_LegalTerms_Slug" ON "LegalTerms" ("Slug");
        CREATE INDEX IF NOT EXISTS "IX_LegalTerms_Letter" ON "LegalTerms" ("Letter");
        CREATE INDEX IF NOT EXISTS "IX_LegalTerms_Category" ON "LegalTerms" ("Category");
    """);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("FrontendPolicy");

// Görselleri proje kökündeki uploads/ klasöründen sun
var uploadsPath = app.Configuration["UploadsPath"]
    ?? Path.Combine(app.Environment.ContentRootPath, "uploads");
Directory.CreateDirectory(uploadsPath);
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(uploadsPath),
    RequestPath = "/uploads"
});
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
