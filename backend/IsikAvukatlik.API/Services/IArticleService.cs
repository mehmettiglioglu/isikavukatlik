using IsikAvukatlik.API.DTOs;
using IsikAvukatlik.API.DTOs.Common;

namespace IsikAvukatlik.API.Services;

public interface IArticleService
{
    Task<PagedResponse<ArticleListDto>> GetPublishedAsync(int page, int pageSize, string? categorySlug);
    Task<ArticleDetailDto?> GetBySlugAsync(string slug);
    Task<AdminArticleDetailDto?> GetByIdAdminAsync(int id);
    Task<PagedResponse<AdminArticleListDto>> GetAllAdminAsync(int page, int pageSize);
    Task<(int id, string slug)> CreateAsync(CreateArticleRequest request);
    Task<bool> UpdateAsync(int id, UpdateArticleRequest request);
    Task<bool> DeleteAsync(int id);
}
