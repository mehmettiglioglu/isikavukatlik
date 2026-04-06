using IsikAvukatlik.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IsikAvukatlik.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class UploadController : ControllerBase
{
    private readonly IFileUploadService _uploadService;

    public UploadController(IFileUploadService uploadService) => _uploadService = uploadService;

    [HttpPost("image")]
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        var url = await _uploadService.UploadImageAsync(file, Request);
        return Ok(new { url });
    }
}
