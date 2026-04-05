using IsikAvukatlik.API.Data;
using IsikAvukatlik.API.DTOs;
using IsikAvukatlik.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IsikAvukatlik.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ArticlesController : ControllerBase
{
    private readonly AppDbContext _db;

    public ArticlesController(AppDbContext db) => _db = db;

    // PUBLIC — Yayınlanmış makaleler (SSR için Next.js kullanır)
    [HttpGet]
    public async Task<IActionResult> GetPublished(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? categorySlug = null)
    {
        var query = _db.Articles
            .Where(a => a.IsPublished)
            .Include(a => a.Category)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(categorySlug))
            query = query.Where(a => a.Category.Slug == categorySlug);

        var total = await query.CountAsync();

        var articles = await query
            .OrderByDescending(a => a.PublishedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(a => new ArticleListDto(
                a.Id,
                a.Title,
                a.Slug,
                a.Summary,
                a.CoverImageUrl,
                a.Category.Name,
                a.Category.Slug,
                a.PublishedAt
            ))
            .ToListAsync();

        return Ok(new { total, page, pageSize, data = articles });
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var article = await _db.Articles
            .Include(a => a.Category)
            .Where(a => a.Slug == slug && a.IsPublished)
            .Select(a => new ArticleDetailDto(
                a.Id,
                a.Title,
                a.Slug,
                a.Summary,
                a.Content,
                a.CoverImageUrl,
                a.MetaTitle,
                a.MetaDescription,
                a.Category.Name,
                a.Category.Slug,
                a.PublishedAt,
                a.UpdatedAt
            ))
            .FirstOrDefaultAsync();

        return article is null ? NotFound() : Ok(article);
    }

    // ADMIN — Tek makale ID ile (JWT gerektirir)
    [Authorize(Roles = "Admin")]
    [HttpGet("admin/{id:int}")]
    public async Task<IActionResult> GetByIdAdmin(int id)
    {
        var article = await _db.Articles
            .Include(a => a.Category)
            .Where(a => a.Id == id)
            .Select(a => new
            {
                a.Id, a.Title, a.Slug, a.Summary, a.Content,
                a.CoverImageUrl, a.MetaTitle, a.MetaDescription,
                a.IsPublished, a.CategoryId,
                CategoryName = a.Category.Name,
                a.PublishedAt, a.UpdatedAt
            })
            .FirstOrDefaultAsync();

        return article is null ? NotFound() : Ok(article);
    }

    // ADMIN — Tüm makaleler (JWT gerektirir)
    [Authorize(Roles = "Admin")]
    [HttpGet("admin/all")]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var total = await _db.Articles.CountAsync();
        var articles = await _db.Articles
            .Include(a => a.Category)
            .OrderByDescending(a => a.UpdatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(a => new
            {
                a.Id, a.Title, a.Slug, a.IsPublished,
                a.CoverImageUrl, a.Category.Name,
                CategorySlug = a.Category.Slug,
                a.PublishedAt, a.UpdatedAt
            })
            .ToListAsync();

        return Ok(new { total, page, pageSize, data = articles });
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateArticleDto dto)
    {
        if (!await _db.Categories.AnyAsync(c => c.Id == dto.CategoryId))
            return BadRequest(new { message = "Geçersiz kategori." });

        if (await _db.Articles.AnyAsync(a => a.Slug == dto.Slug))
            return Conflict(new { message = "Bu slug zaten kullanımda." });

        var article = new Article
        {
            Title = dto.Title,
            Slug = dto.Slug,
            Summary = dto.Summary,
            Content = dto.Content,
            CoverImageUrl = dto.CoverImageUrl,
            MetaTitle = dto.MetaTitle,
            MetaDescription = dto.MetaDescription,
            IsPublished = dto.IsPublished,
            CategoryId = dto.CategoryId,
            PublishedAt = dto.IsPublished ? DateTime.UtcNow : null
        };

        _db.Articles.Add(article);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetBySlug), new { slug = article.Slug }, new { article.Id, article.Slug });
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateArticleDto dto)
    {
        var article = await _db.Articles.FindAsync(id);
        if (article is null) return NotFound();

        if (await _db.Articles.AnyAsync(a => a.Slug == dto.Slug && a.Id != id))
            return Conflict(new { message = "Bu slug başka bir makalede kullanılıyor." });

        article.Title = dto.Title;
        article.Slug = dto.Slug;
        article.Summary = dto.Summary;
        article.Content = dto.Content;
        article.CoverImageUrl = dto.CoverImageUrl;
        article.MetaTitle = dto.MetaTitle;
        article.MetaDescription = dto.MetaDescription;
        article.CategoryId = dto.CategoryId;
        article.UpdatedAt = DateTime.UtcNow;

        if (dto.IsPublished && !article.IsPublished)
            article.PublishedAt = DateTime.UtcNow;

        article.IsPublished = dto.IsPublished;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var article = await _db.Articles.FindAsync(id);
        if (article is null) return NotFound();

        _db.Articles.Remove(article);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
