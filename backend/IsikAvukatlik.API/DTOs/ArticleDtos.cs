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

public record AdminArticleListDto(
    int Id,
    string Title,
    string Slug,
    bool IsPublished,
    string? CoverImageUrl,
    string CategoryName,
    string CategorySlug,
    DateTime? PublishedAt,
    DateTime UpdatedAt
);

public record AdminArticleDetailDto(
    int Id,
    string Title,
    string Slug,
    string? Summary,
    string Content,
    string? CoverImageUrl,
    string? MetaTitle,
    string? MetaDescription,
    bool IsPublished,
    int CategoryId,
    string CategoryName,
    DateTime? PublishedAt,
    DateTime UpdatedAt
);

public record CreateArticleRequest
{
    [Required, MaxLength(300)]
    public required string Title { get; init; }

    [Required, MaxLength(350)]
    public required string Slug { get; init; }

    [MaxLength(500)]
    public string? Summary { get; init; }

    [Required]
    public required string Content { get; init; }

    [MaxLength(2048)]
    public string? CoverImageUrl { get; init; }

    [MaxLength(300)]
    public string? MetaTitle { get; init; }

    [MaxLength(500)]
    public string? MetaDescription { get; init; }

    public bool IsPublished { get; init; }

    [Required]
    public required int CategoryId { get; init; }
}

public record UpdateArticleRequest : CreateArticleRequest;
