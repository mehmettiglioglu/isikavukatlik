using IsikAvukatlik.API.DTOs;
using IsikAvukatlik.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IsikAvukatlik.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ArticlesController : ControllerBase
{
    private readonly IArticleService _articleService;

    public ArticlesController(IArticleService articleService) => _articleService = articleService;

    [HttpGet]
    public async Task<IActionResult> GetPublished(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? categorySlug = null)
    {
        var result = await _articleService.GetPublishedAsync(page, pageSize, categorySlug);
        return Ok(new { total = result.Total, page = result.Page, pageSize = result.PageSize, data = result.Data });
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var article = await _articleService.GetBySlugAsync(slug);
        return article is null ? NotFound() : Ok(article);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("admin/{id:int}")]
    public async Task<IActionResult> GetByIdAdmin(int id)
    {
        var article = await _articleService.GetByIdAdminAsync(id);
        return article is null ? NotFound() : Ok(article);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("admin/all")]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var result = await _articleService.GetAllAdminAsync(page, pageSize);
        return Ok(new { total = result.Total, page = result.Page, pageSize = result.PageSize, data = result.Data });
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateArticleRequest request)
    {
        var (id, slug) = await _articleService.CreateAsync(request);
        return CreatedAtAction(nameof(GetBySlug), new { slug }, new { id, slug });
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateArticleRequest request)
    {
        var updated = await _articleService.UpdateAsync(id, request);
        return updated ? NoContent() : NotFound();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _articleService.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}
