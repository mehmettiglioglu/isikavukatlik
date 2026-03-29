using IsikAvukatlik.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IsikAvukatlik.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _db;

    public CategoriesController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _db.Categories
            .OrderBy(c => c.Name)
            .Select(c => new
            {
                c.Id,
                c.Name,
                c.Slug,
                c.Description,
                ArticleCount = c.Articles.Count(a => a.IsPublished)
            })
            .ToListAsync();

        return Ok(categories);
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var category = await _db.Categories
            .Where(c => c.Slug == slug)
            .Select(c => new
            {
                c.Id,
                c.Name,
                c.Slug,
                c.Description
            })
            .FirstOrDefaultAsync();

        return category is null ? NotFound() : Ok(category);
    }
}
