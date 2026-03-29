using System.ComponentModel.DataAnnotations;

namespace IsikAvukatlik.API.Models;

/// <summary>
/// Dosya Takibi — Altyapı modeli. UI henüz aktif değil.
/// </summary>
public class CaseFile
{
    public int Id { get; set; }

    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? CaseNumber { get; set; }

    [MaxLength(1000)]
    public string? Description { get; set; }

    public CaseStatus Status { get; set; } = CaseStatus.Active;

    public DateTime OpenedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ClosedAt { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public enum CaseStatus
{
    Active = 0,
    Pending = 1,
    Closed = 2,
    Archived = 3
}
