namespace IsikAvukatlik.API.DTOs.Common;

public record ApiResponse<T>(bool Success, T? Data = default, string? Error = null);

public record ApiErrorResponse(bool Success, string Error);
