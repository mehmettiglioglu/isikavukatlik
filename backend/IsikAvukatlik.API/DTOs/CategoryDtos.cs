namespace IsikAvukatlik.API.DTOs;

public record CategoryDto(int Id, string Name, string Slug, string? Description, int ArticleCount);

public record CategoryDetailDto(int Id, string Name, string Slug, string? Description);
