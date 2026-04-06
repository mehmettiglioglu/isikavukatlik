using IsikAvukatlik.API.Data;
using IsikAvukatlik.API.DTOs;
using IsikAvukatlik.API.Models;
using Microsoft.EntityFrameworkCore;

namespace IsikAvukatlik.API.Services;

public class ContactService : IContactService
{
    private readonly AppDbContext _db;
    private readonly ILogger<ContactService> _logger;

    public ContactService(AppDbContext db, ILogger<ContactService> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task<int> SubmitAsync(CreateContactRequest request)
    {
        var message = new ContactMessage
        {
            Name = request.Name,
            Email = request.Email,
            Phone = request.Phone,
            Subject = request.Subject,
            Message = request.Message
        };

        _db.ContactMessages.Add(message);
        await _db.SaveChangesAsync();

        _logger.LogInformation("Contact message submitted: {Id} from {Name}", message.Id, message.Name);

        return message.Id;
    }

    public async Task<List<ContactMessageDto>> GetAllAsync()
    {
        return await _db.ContactMessages
            .OrderByDescending(m => m.CreatedAt)
            .Select(m => new ContactMessageDto(
                m.Id, m.Name, m.Email, m.Phone,
                m.Subject, m.Message, m.CreatedAt, m.IsRead
            ))
            .ToListAsync();
    }

    public async Task<bool> MarkReadAsync(int id)
    {
        var msg = await _db.ContactMessages.FindAsync(id);
        if (msg is null) return false;

        msg.IsRead = true;
        await _db.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var msg = await _db.ContactMessages.FindAsync(id);
        if (msg is null) return false;

        _db.ContactMessages.Remove(msg);
        await _db.SaveChangesAsync();

        _logger.LogInformation("Contact message deleted: {Id}", id);

        return true;
    }

    public async Task<int> DeleteBulkAsync(List<int> ids)
    {
        var messages = await _db.ContactMessages
            .Where(m => ids.Contains(m.Id))
            .ToListAsync();

        if (messages.Count == 0) return 0;

        _db.ContactMessages.RemoveRange(messages);
        await _db.SaveChangesAsync();

        _logger.LogInformation("Contact messages bulk deleted: {Count} messages", messages.Count);

        return messages.Count;
    }
}
