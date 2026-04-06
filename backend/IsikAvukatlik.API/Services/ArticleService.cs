using IsikAvukatlik.API.Data;
using IsikAvukatlik.API.DTOs;
using IsikAvukatlik.API.DTOs.Common;
using IsikAvukatlik.API.Models;
using Microsoft.EntityFrameworkCore;

namespace IsikAvukatlik.API.Services;

public class ArticleService : IArticleService
{
    private readonly AppDbContext _db;
    private readonly ILogger<ArticleService> _logger;

    public ArticleService(AppDbContext db, ILogger<ArticleService> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task<PagedResponse<ArticleListDto>> GetPublishedAsync(int page, int pageSize, string? categorySlug)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 50);

        var query = _db.Articles
            .Where(a => a.IsPublished)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(categorySlug))
            query = query.Where(a => a.Category.Slug == categorySlug);

        var total = await query.CountAsync();

        var articles = await query
            .OrderByDescending(a => a.PublishedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(a => new ArticleListDto(
                a.Id, a.Title, a.Slug, a.Summary, a.CoverImageUrl,
                a.Category.Name, a.Category.Slug, a.PublishedAt
            ))
            .ToListAsync();

        return new PagedResponse<ArticleListDto>(articles, total, page, pageSize);
    }

    public async Task<ArticleDetailDto?> GetBySlugAsync(string slug)
    {
        return await _db.Articles
            .Where(a => a.Slug == slug && a.IsPublished)
            .Select(a => new ArticleDetailDto(
                a.Id, a.Title, a.Slug, a.Summary, a.Content,
                a.CoverImageUrl, a.MetaTitle, a.MetaDescription,
                a.Category.Name, a.Category.Slug,
                a.PublishedAt, a.UpdatedAt
            ))
            .FirstOrDefaultAsync();
    }

    public async Task<AdminArticleDetailDto?> GetByIdAdminAsync(int id)
    {
        return await _db.Articles
            .Where(a => a.Id == id)
            .Select(a => new AdminArticleDetailDto(
                a.Id, a.Title, a.Slug, a.Summary, a.Content,
                a.CoverImageUrl, a.MetaTitle, a.MetaDescription,
                a.IsPublished, a.CategoryId, a.Category.Name,
                a.PublishedAt, a.UpdatedAt
            ))
            .FirstOrDefaultAsync();
    }

    public async Task<PagedResponse<AdminArticleListDto>> GetAllAdminAsync(int page, int pageSize)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var total = await _db.Articles.CountAsync();

        var articles = await _db.Articles
            .OrderByDescending(a => a.UpdatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(a => new AdminArticleListDto(
                a.Id, a.Title, a.Slug, a.IsPublished,
                a.CoverImageUrl, a.Category.Name, a.Category.Slug,
                a.PublishedAt, a.UpdatedAt
            ))
            .ToListAsync();

        return new PagedResponse<AdminArticleListDto>(articles, total, page, pageSize);
    }

    public async Task<(int id, string slug)> CreateAsync(CreateArticleRequest request)
    {
        if (!await _db.Categories.AnyAsync(c => c.Id == request.CategoryId))
            throw new ArgumentException("Gecersiz kategori.");

        if (await _db.Articles.AnyAsync(a => a.Slug == request.Slug))
            throw new InvalidOperationException("Bu slug zaten kullanimda.");

        var article = new Article
        {
            Title = request.Title,
            Slug = request.Slug,
            Summary = request.Summary,
            Content = request.Content,
            CoverImageUrl = request.CoverImageUrl,
            MetaTitle = request.MetaTitle,
            MetaDescription = request.MetaDescription,
            IsPublished = request.IsPublished,
            CategoryId = request.CategoryId,
            PublishedAt = request.IsPublished ? DateTime.UtcNow : null
        };

        _db.Articles.Add(article);
        await _db.SaveChangesAsync();

        _logger.LogInformation("Article created: {Id} {Slug}", article.Id, article.Slug);

        return (article.Id, article.Slug);
    }

    public async Task<bool> UpdateAsync(int id, UpdateArticleRequest request)
    {
        var article = await _db.Articles.FindAsync(id);
        if (article is null) return false;

        if (await _db.Articles.AnyAsync(a => a.Slug == request.Slug && a.Id != id))
            throw new InvalidOperationException("Bu slug baska bir makalede kullaniliyor.");

        article.Title = request.Title;
        article.Slug = request.Slug;
        article.Summary = request.Summary;
        article.Content = request.Content;
        article.CoverImageUrl = request.CoverImageUrl;
        article.MetaTitle = request.MetaTitle;
        article.MetaDescription = request.MetaDescription;
        article.CategoryId = request.CategoryId;
        article.UpdatedAt = DateTime.UtcNow;

        if (request.IsPublished && !article.IsPublished)
            article.PublishedAt = DateTime.UtcNow;

        article.IsPublished = request.IsPublished;

        await _db.SaveChangesAsync();

        _logger.LogInformation("Article updated: {Id}", id);

        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var article = await _db.Articles.FindAsync(id);
        if (article is null) return false;

        _db.Articles.Remove(article);
        await _db.SaveChangesAsync();

        _logger.LogInformation("Article deleted: {Id}", id);

        return true;
    }
}
