using IsikAvukatlik.API.DTOs;

namespace IsikAvukatlik.API.Services;

public interface IContactService
{
    Task<int> SubmitAsync(CreateContactRequest request);
    Task<List<ContactMessageDto>> GetAllAsync();
    Task<bool> MarkReadAsync(int id);
    Task<bool> DeleteAsync(int id);
    Task<int> DeleteBulkAsync(List<int> ids);
}
