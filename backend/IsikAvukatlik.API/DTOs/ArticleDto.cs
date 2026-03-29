using System.ComponentModel.DataAnnotations;

namespace IsikAvukatlik.API.DTOs;

public record ArticleListDto(
    int Id,
    string Title,
    string Slug,
    string? Summary,
    string? CoverImageUrl,
    string CategoryName,
    string CategorySlug,
    DateTime? PublishedAt
);

public record ArticleDetailDto(
    int Id,
    string Title,
    string Slug,
    string? Summary,
    string Content,
    string? CoverImageUrl,
    string? MetaTitle,
    string? MetaDescription,
    string CategoryName,
    string CategorySlug,
    DateTime? PublishedAt,
    DateTime UpdatedAt
);

public class CreateArticleDto
{
    [Required, MaxLength(300)]
    public string Title { get; set; } = string.Empty;

    [Required, MaxLength(350)]
    public string Slug { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Summary { get; set; }

    [Required]
    public string Content { get; set; } = string.Empty;

    [MaxLength(2048)]
    public string? CoverImageUrl { get; set; }

    [MaxLength(300)]
    public string? MetaTitle { get; set; }

    [MaxLength(500)]
    public string? MetaDescription { get; set; }

    public bool IsPublished { get; set; } = false;

    [Required]
    public int CategoryId { get; set; }
}

public class UpdateArticleDto : CreateArticleDto { }
