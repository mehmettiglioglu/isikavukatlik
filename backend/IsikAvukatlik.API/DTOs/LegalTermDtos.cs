using System.ComponentModel.DataAnnotations;

namespace IsikAvukatlik.API.DTOs;

public record LegalTermListItemDto(
    int Id,
    string Title,
    string Slug,
    string Letter,
    string Category,
    string? ShortDescription
);

public record LegalTermDetailDto(
    int Id,
    string Title,
    string Slug,
    string Letter,
    string Category,
    string Definition,
    string? ShortDescription,
    DateTime UpdatedAt,
    List<RelatedArticleDto> RelatedArticles
);

public record RelatedArticleDto(
    string Title,
    string Slug,
    string? Summary,
    string CategoryName,
    string? PublishedAt
);

public record LegalTermUpsertRequest
{
    [Required, MaxLength(300)]
    public required string Title { get; init; }

    [Required, MaxLength(350)]
    public required string Slug { get; init; }

    [Required, MaxLength(1)]
    public required string Letter { get; init; }

    [Required, MaxLength(200)]
    public required string Category { get; init; }

    [Required]
    public required string Definition { get; init; }

    [MaxLength(500)]
    public string? ShortDescription { get; init; }

    public bool IsPublished { get; init; } = true;
}
