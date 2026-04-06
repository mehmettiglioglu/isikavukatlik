using IsikAvukatlik.API.DTOs;

namespace IsikAvukatlik.API.Services;

public interface ILegalTermService
{
    Task<List<LegalTermListItemDto>> GetAllPublishedAsync();
    Task<LegalTermDetailDto?> GetBySlugAsync(string slug);
    Task<(int id, string slug)> CreateAsync(LegalTermUpsertRequest request);
    Task<bool> UpdateAsync(int id, LegalTermUpsertRequest request);
    Task<bool> DeleteAsync(int id);
    Task<int> SeedFromJsonAsync(string jsonPath);
}
