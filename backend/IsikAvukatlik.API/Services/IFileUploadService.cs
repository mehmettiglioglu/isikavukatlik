namespace IsikAvukatlik.API.Services;

public interface IFileUploadService
{
    Task<string> UploadImageAsync(IFormFile file, HttpRequest request);
}
