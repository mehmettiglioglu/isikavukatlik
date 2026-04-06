using System.ComponentModel.DataAnnotations;

namespace IsikAvukatlik.API.DTOs;

public record LoginRequestDto
{
    [Required]
    public required string Username { get; init; }

    [Required]
    public required string Password { get; init; }
}

public record LoginResponseDto(string Token, string Username, string Role, DateTime ExpiresAt);
