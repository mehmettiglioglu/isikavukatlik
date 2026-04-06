using System.ComponentModel.DataAnnotations;

namespace IsikAvukatlik.API.DTOs;

public record CreateContactRequest
{
    [Required, MaxLength(100)]
    public required string Name { get; init; }

    [EmailAddress, MaxLength(150)]
    public string? Email { get; init; }

    [MaxLength(20)]
    public string? Phone { get; init; }

    [Required, MaxLength(200)]
    public required string Subject { get; init; }

    [Required, MaxLength(2000)]
    public required string Message { get; init; }
}

public record ContactMessageDto(
    int Id,
    string Name,
    string? Email,
    string? Phone,
    string Subject,
    string Message,
    DateTime CreatedAt,
    bool IsRead
);
