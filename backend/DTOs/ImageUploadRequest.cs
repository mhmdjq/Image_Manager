using System.ComponentModel.DataAnnotations;

namespace ImageOverlay.Api.DTOs;

public class ImageUploadRequest
{
    [Required]
    [StringLength(100)]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }
    public string? OverlayText { get; set; }

    [Required]
    public IFormFile File { get; set; } = null!;
}