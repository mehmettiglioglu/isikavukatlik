using IsikAvukatlik.API.DTOs;

namespace IsikAvukatlik.API.Services;

public interface ICategoryService
{
    Task<List<CategoryDto>> GetAllAsync();
    Task<CategoryDetailDto?> GetBySlugAsync(string slug);
}
