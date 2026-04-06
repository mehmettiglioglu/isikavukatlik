using IsikAvukatlik.API.DTOs;
using IsikAvukatlik.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IsikAvukatlik.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly IContactService _contactService;

    public ContactController(IContactService contactService) => _contactService = contactService;

    [HttpPost]
    public async Task<IActionResult> Submit([FromBody] CreateContactRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        await _contactService.SubmitAsync(request);
        return Ok(new { success = true });
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll()
    {
        var messages = await _contactService.GetAllAsync();
        return Ok(messages);
    }

    [HttpPatch("{id}/read")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> MarkRead(int id)
    {
        var marked = await _contactService.MarkReadAsync(id);
        return marked ? NoContent() : NotFound();
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _contactService.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }

    [HttpPost("delete-bulk")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteBulk([FromBody] List<int> ids)
    {
        if (ids is null || ids.Count == 0)
            return BadRequest(new { error = "Silinecek mesaj ID'leri belirtilmedi." });

        var count = await _contactService.DeleteBulkAsync(ids);
        return Ok(new { deleted = count });
    }
}
