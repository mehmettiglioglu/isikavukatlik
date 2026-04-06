namespace IsikAvukatlik.API.DTOs.Common;

public record PagedResponse<T>(IReadOnlyList<T> Data, int Total, int Page, int PageSize);
