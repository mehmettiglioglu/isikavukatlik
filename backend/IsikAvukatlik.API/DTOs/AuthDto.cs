using System.ComponentModel.DataAnnotations;

namespace IsikAvukatlik.API.DTOs;

public class LoginRequestDto
{
    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}

public record LoginResponseDto(string Token, string Username, string Role, DateTime ExpiresAt);
