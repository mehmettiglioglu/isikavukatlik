using IsikAvukatlik.API.Data;
using IsikAvukatlik.API.DTOs;
using Microsoft.EntityFrameworkCore;

namespace IsikAvukatlik.API.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly ITokenService _tokenService;
    private readonly ILogger<AuthService> _logger;

    public AuthService(AppDbContext db, ITokenService tokenService, ILogger<AuthService> logger)
    {
        _db = db;
        _tokenService = tokenService;
        _logger = logger;
    }

    public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto request)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == request.Username);

        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            _logger.LogWarning("Failed login attempt for user: {Username}", request.Username);
            return null;
        }

        var (token, expiresAt) = _tokenService.CreateToken(user);

        _logger.LogInformation("User logged in: {Username}", user.Username);

        return new LoginResponseDto(token, user.Username, user.Role, expiresAt);
    }
}
