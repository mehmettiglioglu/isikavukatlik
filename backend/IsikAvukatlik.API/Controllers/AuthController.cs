using IsikAvukatlik.API.DTOs;
using IsikAvukatlik.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace IsikAvukatlik.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService) => _authService = authService;

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
    {
        var result = await _authService.LoginAsync(dto);

        if (result is null)
            return Unauthorized(new { message = "Kullanici adi veya sifre hatali." });

        return Ok(result);
    }
}
