using System.Text;
using IsikAvukatlik.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IsikAvukatlik.API.Controllers;

[ApiController]
public class SitemapController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public SitemapController(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    [HttpGet("/sitemap.xml")]
    [ResponseCache(Duration = 3600)]
    public async Task<IActionResult> Get()
    {
        var baseUrl = (_config["AllowedOrigins:Prod"] ?? "https://isikavukatlik.tr").TrimEnd('/');
        var now = DateTime.UtcNow.ToString("yyyy-MM-dd");

        var sb = new StringBuilder();
        sb.AppendLine("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
        sb.AppendLine("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">");

        // Statik sayfalar
        string[][] staticPages =
        [
            ["/",                  "1.0", "weekly"],
            ["/hakkimizda",        "0.8", "monthly"],
            ["/calisma-alanlari",  "0.9", "weekly"],
            ["/blog",              "0.9", "daily"],
            ["/hesaplamalar",      "0.8", "weekly"],
            ["/iletisim",          "0.7", "monthly"],
            ["/sozluk",            "0.9", "weekly"],
        ];

        foreach (var page in staticPages)
        {
            AddUrl(sb, baseUrl + page[0], now, page[1], page[2]);
        }

        // Çalışma alanları (statik sluglar)
        string[] practiceAreas =
        [
            "is-hukuku", "kira-hukuku", "icra-iflas-hukuku", "tazminat-hukuku",
            "sozlesme-hukuku", "ticaret-hukuku", "miras-hukuku", "gayrimenkul-hukuku",
            "bosanma-aile-hukuku", "ceza-hukuku", "tuketici-hukuku", "idare-hukuku",
            "saglik-hukuku", "yabancilar-hukuku"
        ];

        foreach (var slug in practiceAreas)
        {
            AddUrl(sb, $"{baseUrl}/calisma-alanlari/{slug}", now, "0.8", "monthly");
        }

        // Hesaplama araçları (statik sluglar)
        string[] calculators =
        [
            "kidem-tazminati", "ihbar-tazminati", "yillik-izin", "is-kazasi-tazminati",
            "nafaka", "miras-paylasimi", "icra-masrafi", "gecikme-faizi",
            "vekalet-ucreti", "islah-harci", "trafik-tazminati", "arac-deger-kaybi",
            "adli-para-cezasi", "kira-artis", "e-tebligat"
        ];

        foreach (var slug in calculators)
        {
            AddUrl(sb, $"{baseUrl}/hesaplamalar/{slug}", now, "0.7", "monthly");
        }

        // Blog makaleleri (DB'den)
        var articles = await _db.Articles
            .Where(a => a.IsPublished)
            .OrderByDescending(a => a.PublishedAt)
            .Select(a => new { a.Slug, a.UpdatedAt })
            .ToListAsync();

        foreach (var a in articles)
        {
            AddUrl(sb, $"{baseUrl}/blog/{a.Slug}", a.UpdatedAt.ToString("yyyy-MM-dd"), "0.8", "weekly");
        }

        // Hukuki terimler (DB'den)
        var terms = await _db.LegalTerms
            .Where(t => t.IsPublished)
            .OrderBy(t => t.Title)
            .Select(t => new { t.Slug, t.UpdatedAt })
            .ToListAsync();

        foreach (var t in terms)
        {
            AddUrl(sb, $"{baseUrl}/sozluk/{t.Slug}", t.UpdatedAt.ToString("yyyy-MM-dd"), "0.6", "monthly");
        }

        sb.AppendLine("</urlset>");

        return Content(sb.ToString(), "application/xml", Encoding.UTF8);
    }

    private static void AddUrl(StringBuilder sb, string loc, string lastmod, string priority, string changefreq)
    {
        sb.AppendLine("  <url>");
        sb.AppendLine($"    <loc>{loc}</loc>");
        sb.AppendLine($"    <lastmod>{lastmod}</lastmod>");
        sb.AppendLine($"    <changefreq>{changefreq}</changefreq>");
        sb.AppendLine($"    <priority>{priority}</priority>");
        sb.AppendLine("  </url>");
    }
}
