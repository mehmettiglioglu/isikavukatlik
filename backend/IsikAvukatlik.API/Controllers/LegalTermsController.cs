using IsikAvukatlik.API.Data;
using IsikAvukatlik.API.DTOs;
using IsikAvukatlik.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IsikAvukatlik.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LegalTermsController : ControllerBase
{
    private readonly AppDbContext _db;
    public LegalTermsController(AppDbContext db) => _db = db;

    // Public: tüm yayınlanmış terimler (liste)
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var terms = await _db.LegalTerms
            .Where(t => t.IsPublished)
            .OrderBy(t => t.Letter)
            .ThenBy(t => t.Title)
            .Select(t => new LegalTermListItemDto
            {
                Id = t.Id,
                Title = t.Title,
                Slug = t.Slug,
                Letter = t.Letter,
                Category = t.Category,
                ShortDescription = t.ShortDescription,
            })
            .ToListAsync();

        return Ok(terms);
    }

    // Public: tek terim + ilgili makaleler
    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var term = await _db.LegalTerms
            .Where(t => t.IsPublished && t.Slug == slug)
            .FirstOrDefaultAsync();

        if (term is null) return NotFound();

        // İlgili makaleler: aynı kategori adı veya başlıkta terim geçiyorsa
        var keywords = term.Category.Split(' ', StringSplitOptions.RemoveEmptyEntries)
            .Where(w => w.Length > 3)
            .ToArray();

        var relatedQuery = _db.Articles
            .Include(a => a.Category)
            .Where(a => a.IsPublished);

        if (keywords.Length > 0)
        {
            relatedQuery = relatedQuery.Where(a =>
                keywords.Any(k => EF.Functions.ILike(a.Category.Name, $"%{k}%")) ||
                keywords.Any(k => EF.Functions.ILike(a.Title, $"%{k}%"))
            );
        }

        var related = await relatedQuery
            .OrderByDescending(a => a.PublishedAt)
            .Take(4)
            .Select(a => new RelatedArticleDto
            {
                Title = a.Title,
                Slug = a.Slug,
                Summary = a.Summary,
                CategoryName = a.Category.Name,
                PublishedAt = a.PublishedAt != null ? a.PublishedAt.Value.ToString("o") : null,
            })
            .ToListAsync();

        var dto = new LegalTermDetailDto
        {
            Id = term.Id,
            Title = term.Title,
            Slug = term.Slug,
            Letter = term.Letter,
            Category = term.Category,
            Definition = term.Definition,
            ShortDescription = term.ShortDescription,
            UpdatedAt = term.UpdatedAt,
            RelatedArticles = related,
        };

        return Ok(dto);
    }

    // Admin: CRUD
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] LegalTermUpsertDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var term = new LegalTerm
        {
            Title = dto.Title,
            Slug = dto.Slug,
            Letter = dto.Letter.ToUpperInvariant(),
            Category = dto.Category,
            Definition = dto.Definition,
            ShortDescription = dto.ShortDescription,
            IsPublished = dto.IsPublished,
        };

        _db.LegalTerms.Add(term);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetBySlug), new { slug = term.Slug }, new { term.Id });
    }

    [HttpPut("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Update(int id, [FromBody] LegalTermUpsertDto dto)
    {
        var term = await _db.LegalTerms.FindAsync(id);
        if (term is null) return NotFound();

        term.Title = dto.Title;
        term.Slug = dto.Slug;
        term.Letter = dto.Letter.ToUpperInvariant();
        term.Category = dto.Category;
        term.Definition = dto.Definition;
        term.ShortDescription = dto.ShortDescription;
        term.IsPublished = dto.IsPublished;
        term.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var term = await _db.LegalTerms.FindAsync(id);
        if (term is null) return NotFound();
        _db.LegalTerms.Remove(term);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
