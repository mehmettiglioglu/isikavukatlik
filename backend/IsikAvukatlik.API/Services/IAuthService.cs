using IsikAvukatlik.API.DTOs;

namespace IsikAvukatlik.API.Services;

public interface IAuthService
{
    Task<LoginResponseDto?> LoginAsync(LoginRequestDto request);
}
