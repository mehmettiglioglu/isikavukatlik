namespace IsikAvukatlik.API.Services;

public class FileUploadService : IFileUploadService
{
    private readonly IWebHostEnvironment _env;
    private readonly IConfiguration _config;
    private readonly ILogger<FileUploadService> _logger;

    private static readonly string[] AllowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    private const long MaxFileSizeBytes = 5 * 1024 * 1024; // 5 MB

    public FileUploadService(IWebHostEnvironment env, IConfiguration config, ILogger<FileUploadService> logger)
    {
        _env = env;
        _config = config;
        _logger = logger;
    }

    public async Task<string> UploadImageAsync(IFormFile file, HttpRequest request)
    {
        if (file is null || file.Length == 0)
            throw new ArgumentException("Dosya secilmedi.");

        if (file.Length > MaxFileSizeBytes)
            throw new ArgumentException("Dosya boyutu 5 MB'i gecemez.");

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(ext))
            throw new ArgumentException("Desteklenmeyen dosya turu. JPG, PNG, GIF veya WebP yukleyin.");

        var uploadsDir = _config["UploadsPath"]
            ?? Path.Combine(_env.ContentRootPath, "uploads");
        Directory.CreateDirectory(uploadsDir);

        var fileName = $"{Guid.NewGuid()}{ext}";
        var filePath = Path.Combine(uploadsDir, fileName);

        await using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);

        var baseUrl = _config["BaseUrl"] ?? $"{request.Scheme}://{request.Host}";
        var url = $"{baseUrl}/uploads/{fileName}";

        _logger.LogInformation("Image uploaded: {FileName} ({Size} bytes)", fileName, file.Length);

        return url;
    }
}
