using IsikAvukatlik.API.Data;
using IsikAvukatlik.API.DTOs;
using Microsoft.EntityFrameworkCore;

namespace IsikAvukatlik.API.Services;

public class CategoryService : ICategoryService
{
    private readonly AppDbContext _db;

    public CategoryService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<CategoryDto>> GetAllAsync()
    {
        return await _db.Categories
            .OrderBy(c => c.Name)
            .Select(c => new CategoryDto(
                c.Id, c.Name, c.Slug, c.Description,
                c.Articles.Count(a => a.IsPublished)
            ))
            .ToListAsync();
    }

    public async Task<CategoryDetailDto?> GetBySlugAsync(string slug)
    {
        return await _db.Categories
            .Where(c => c.Slug == slug)
            .Select(c => new CategoryDetailDto(
                c.Id, c.Name, c.Slug, c.Description
            ))
            .FirstOrDefaultAsync();
    }
}
