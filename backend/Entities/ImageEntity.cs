using System.ComponentModel.DataAnnotations;

namespace ImageOverlay.Api.Entities;

public class ImageEntity
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Required]
    public string FileName { get; set; } = string.Empty;

    [Required]
    public string FileUrl { get; set; } = string.Empty;

    public long FileSize { get; set; }

    public int Width { get; set; }

    public int Height { get; set; }

    public string? OverlayText { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}