using System.ComponentModel.DataAnnotations;

namespace IsikAvukatlik.API.Models;

public class LegalTerm
{
    public int Id { get; set; }

    [Required, MaxLength(300)]
    public string Title { get; set; } = string.Empty;

    [Required, MaxLength(350)]
    public string Slug { get; set; } = string.Empty;

    /// <summary>Alfabetik gruplama harfi (A, B, C, ...)</summary>
    [Required, MaxLength(1)]
    public string Letter { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    public string Category { get; set; } = string.Empty;

    [Required]
    public string Definition { get; set; } = string.Empty;

    /// <summary>SEO meta description / özet</summary>
    [MaxLength(500)]
    public string? ShortDescription { get; set; }

    public bool IsPublished { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
