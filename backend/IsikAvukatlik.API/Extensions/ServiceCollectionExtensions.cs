using IsikAvukatlik.API.Services;

namespace IsikAvukatlik.API.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IArticleService, ArticleService>();
        services.AddScoped<ICategoryService, CategoryService>();
        services.AddScoped<IContactService, ContactService>();
        services.AddScoped<ILegalTermService, LegalTermService>();
        services.AddScoped<IFileUploadService, FileUploadService>();

        return services;
    }
}
