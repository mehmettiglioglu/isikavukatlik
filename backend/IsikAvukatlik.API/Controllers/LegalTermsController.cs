using IsikAvukatlik.API.DTOs;
using IsikAvukatlik.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IsikAvukatlik.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LegalTermsController : ControllerBase
{
    private readonly ILegalTermService _legalTermService;

    public LegalTermsController(ILegalTermService legalTermService) => _legalTermService = legalTermService;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var terms = await _legalTermService.GetAllPublishedAsync();
        return Ok(terms);
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var term = await _legalTermService.GetBySlugAsync(slug);
        return term is null ? NotFound() : Ok(term);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] LegalTermUpsertRequest request)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var (id, slug) = await _legalTermService.CreateAsync(request);
        return CreatedAtAction(nameof(GetBySlug), new { slug }, new { id });
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] LegalTermUpsertRequest request)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var updated = await _legalTermService.UpdateAsync(id, request);
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _legalTermService.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }

    /// <summary>
    /// JSON dosyasindan toplu terim import et. Mevcut slug'lar atlanir.
    /// </summary>
    [HttpPost("seed")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Seed([FromServices] IWebHostEnvironment env)
    {
        var jsonPath = Path.Combine(env.ContentRootPath, "legal_terms.json");
        if (!System.IO.File.Exists(jsonPath))
            return NotFound(new { error = "legal_terms.json dosyasi bulunamadi." });

        var count = await _legalTermService.SeedFromJsonAsync(jsonPath);
        return Ok(new { success = true, imported = count });
    }
}
