using System.Text.Json;
using IsikAvukatlik.API.Data;
using IsikAvukatlik.API.DTOs;
using IsikAvukatlik.API.Models;
using Microsoft.EntityFrameworkCore;

namespace IsikAvukatlik.API.Services;

public class LegalTermService : ILegalTermService
{
    private readonly AppDbContext _db;
    private readonly ILogger<LegalTermService> _logger;

    public LegalTermService(AppDbContext db, ILogger<LegalTermService> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task<List<LegalTermListItemDto>> GetAllPublishedAsync()
    {
        return await _db.LegalTerms
            .Where(t => t.IsPublished)
            .OrderBy(t => t.Letter)
            .ThenBy(t => t.Title)
            .Select(t => new LegalTermListItemDto(
                t.Id, t.Title, t.Slug, t.Letter, t.Category, t.ShortDescription
            ))
            .ToListAsync();
    }

    public async Task<LegalTermDetailDto?> GetBySlugAsync(string slug)
    {
        var term = await _db.LegalTerms
            .Where(t => t.IsPublished && t.Slug == slug)
            .FirstOrDefaultAsync();

        if (term is null) return null;

        // Search related articles by category name (ILike for case-insensitive match)
        var categoryPattern = $"%{term.Category.Replace("%", "").Replace("_", "")}%";

        var related = await _db.Articles
            .Where(a => a.IsPublished)
            .Where(a =>
                EF.Functions.ILike(a.Category.Name, categoryPattern) ||
                EF.Functions.ILike(a.Title, categoryPattern))
            .OrderByDescending(a => a.PublishedAt)
            .Take(4)
            .Select(a => new RelatedArticleDto(
                a.Title, a.Slug, a.Summary, a.Category.Name,
                a.PublishedAt != null ? a.PublishedAt.Value.ToString("o") : null
            ))
            .ToListAsync();

        return new LegalTermDetailDto(
            term.Id, term.Title, term.Slug, term.Letter,
            term.Category, term.Definition, term.ShortDescription,
            term.UpdatedAt, related
        );
    }

    public async Task<(int id, string slug)> CreateAsync(LegalTermUpsertRequest request)
    {
        var term = new LegalTerm
        {
            Title = request.Title,
            Slug = request.Slug,
            Letter = request.Letter.ToUpperInvariant(),
            Category = request.Category,
            Definition = request.Definition,
            ShortDescription = request.ShortDescription,
            IsPublished = request.IsPublished
        };

        _db.LegalTerms.Add(term);
        await _db.SaveChangesAsync();

        _logger.LogInformation("LegalTerm created: {Id} {Slug}", term.Id, term.Slug);

        return (term.Id, term.Slug);
    }

    public async Task<bool> UpdateAsync(int id, LegalTermUpsertRequest request)
    {
        var term = await _db.LegalTerms.FindAsync(id);
        if (term is null) return false;

        term.Title = request.Title;
        term.Slug = request.Slug;
        term.Letter = request.Letter.ToUpperInvariant();
        term.Category = request.Category;
        term.Definition = request.Definition;
        term.ShortDescription = request.ShortDescription;
        term.IsPublished = request.IsPublished;
        term.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        _logger.LogInformation("LegalTerm updated: {Id}", id);

        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var term = await _db.LegalTerms.FindAsync(id);
        if (term is null) return false;

        _db.LegalTerms.Remove(term);
        await _db.SaveChangesAsync();

        _logger.LogInformation("LegalTerm deleted: {Id}", id);

        return true;
    }

    public async Task<int> SeedFromJsonAsync(string jsonPath)
    {
        var json = await File.ReadAllTextAsync(jsonPath);
        var items = JsonSerializer.Deserialize<List<LegalTermJsonItem>>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        if (items is null || items.Count == 0)
            throw new ArgumentException("JSON dosyasi bos veya gecersiz.");

        var existingSlugs = await _db.LegalTerms.Select(t => t.Slug).ToListAsync();
        var newTerms = new List<LegalTerm>();

        foreach (var item in items)
        {
            if (existingSlugs.Contains(item.Slug))
                continue;

            // SEO: Definition'dan ShortDescription otomatik olustur
            var shortDesc = item.Definition.Length > 155
                ? item.Definition[..155].TrimEnd() + "..."
                : item.Definition;

            newTerms.Add(new LegalTerm
            {
                Title = item.Title,
                Slug = item.Slug,
                Letter = item.Letter.ToUpperInvariant(),
                Category = string.Empty,
                Definition = item.Definition,
                ShortDescription = shortDesc,
                IsPublished = true,
                CreatedAt = item.CreatedAt,
                UpdatedAt = item.UpdatedAt
            });
        }

        if (newTerms.Count > 0)
        {
            _db.LegalTerms.AddRange(newTerms);
            await _db.SaveChangesAsync();
        }

        _logger.LogInformation("LegalTerms seeded: {Count} new terms from {Path}", newTerms.Count, jsonPath);

        return newTerms.Count;
    }

    private record LegalTermJsonItem(
        int Id,
        string Title,
        string Slug,
        string Letter,
        string Definition,
        DateTime CreatedAt,
        DateTime UpdatedAt
    );
}
