using System.ComponentModel.DataAnnotations;

namespace IsikAvukatlik.API.DTOs;

public class ContactDto
{
    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [EmailAddress, MaxLength(150)]
    public string? Email { get; set; }

    [MaxLength(20)]
    public string? Phone { get; set; }

    [Required, MaxLength(200)]
    public string Subject { get; set; } = string.Empty;

    [Required, MaxLength(2000)]
    public string Message { get; set; } = string.Empty;
}
