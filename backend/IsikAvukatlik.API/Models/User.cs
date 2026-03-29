using System.ComponentModel.DataAnnotations;

namespace IsikAvukatlik.API.Models;

public class User
{
    public int Id { get; set; }

    [Required, MaxLength(150)]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    public string Role { get; set; } = "Admin";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
