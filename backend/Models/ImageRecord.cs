using System.ComponentModel.DataAnnotations;

namespace ImageOverlay.Api.Models;

public class ImageRecord
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string? OverlayText { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string FileUrl => $"/uploads/{FileName}";
}