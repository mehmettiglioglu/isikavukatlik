using IsikAvukatlik.API.Models;

namespace IsikAvukatlik.API.Services;

public interface ITokenService
{
    (string token, DateTime expiresAt) CreateToken(User user);
}
