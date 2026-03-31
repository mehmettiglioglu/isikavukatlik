namespace IsikAvukatlik.API.DTOs;

public class LegalTermListItemDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Letter { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string? ShortDescription { get; set; }
}

public class LegalTermDetailDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Letter { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Definition { get; set; } = string.Empty;
    public string? ShortDescription { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<RelatedArticleDto> RelatedArticles { get; set; } = new();
}

public class RelatedArticleDto
{
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Summary { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string? PublishedAt { get; set; }
}

public class LegalTermUpsertDto
{
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Letter { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Definition { get; set; } = string.Empty;
    public string? ShortDescription { get; set; }
    public bool IsPublished { get; set; } = true;
}
