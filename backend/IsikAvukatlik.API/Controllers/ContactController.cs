using IsikAvukatlik.API.Data;
using IsikAvukatlik.API.DTOs;
using IsikAvukatlik.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IsikAvukatlik.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly AppDbContext _db;

    public ContactController(AppDbContext db) => _db = db;

    [HttpPost]
    public async Task<IActionResult> Submit([FromBody] ContactDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var message = new ContactMessage
        {
            Name = dto.Name,
            Email = dto.Email,
            Phone = dto.Phone,
            Subject = dto.Subject,
            Message = dto.Message,
        };

        _db.ContactMessages.Add(message);
        await _db.SaveChangesAsync();

        return Ok(new { success = true });
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetAll()
    {
        var messages = await _db.ContactMessages
            .OrderByDescending(m => m.CreatedAt)
            .Select(m => new
            {
                m.Id,
                m.Name,
                m.Email,
                m.Phone,
                m.Subject,
                m.Message,
                m.CreatedAt,
                m.IsRead,
            })
            .ToListAsync();

        return Ok(messages);
    }

    [HttpPatch("{id}/read")]
    [Authorize]
    public async Task<IActionResult> MarkRead(int id)
    {
        var msg = await _db.ContactMessages.FindAsync(id);
        if (msg is null) return NotFound();
        msg.IsRead = true;
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
