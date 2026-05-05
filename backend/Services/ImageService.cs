using ImageOverlay.Api.DTOs;
using ImageOverlay.Api.Entities;
using ImageOverlay.Api.Exceptions;
using ImageOverlay.Api.Mappers;
using ImageOverlay.Api.Repositories;
using SixLabors.Fonts;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Drawing.Processing;
using SixLabors.ImageSharp.Processing;

namespace ImageOverlay.Api.Services;

public class ImageService(

    IImageRepository repository,
    IWebHostEnvironment env) : IImageService
{
    private readonly string _uploadPath = Path.Combine(env.WebRootPath, "uploads");

    public async Task<IEnumerable<ImageResponseDto>> GetAllAsync()
    {
        var entities = await repository.GetAllAsync();
        return entities.Select(e => e.ToDto());
    }

    public async Task<ImageResponseDto> GetByIdAsync(Guid id)
    {
        var entity = await repository.GetByIdAsync(id);
        if (entity == null) throw new ImageNotFoundException(id); // Clean!
        return entity.ToDto();
    } 

    public async Task<ImageResponseDto> UploadAsync(ImageUploadRequest request)
    {
        using var stream = request.File.OpenReadStream();
        if (!IsValidImage(stream)) throw new Exception("Invalid image format.");

        // 1. YOUR FILENAME LOGIC: Timestamp + Sanitized Title
        string timestamp = DateTime.Now.ToString("yyyyMMdd_HHmm");
        string safeTitle = string.Concat(request.Title.Where(c => char.IsLetterOrDigit(c) || char.IsWhiteSpace(c)))
                                 .Trim().Replace(" ", "-").ToLower();
        if (safeTitle.Length > 25) safeTitle = safeTitle.Substring(0, 25);

        var fileName = $"{timestamp}_{safeTitle}{Path.GetExtension(request.File.FileName)}";
        var filePath = Path.Combine(_uploadPath, fileName);

        using var image = await Image.LoadAsync(stream);

        // Apply overlay immediately if text was provided during upload
        if (!string.IsNullOrEmpty(request.OverlayText))
        {
            ApplyYourCustomOverlay(image, request.OverlayText);
            fileName = "overlay_" + fileName; // Your persistence logic
            filePath = Path.Combine(_uploadPath, fileName);
        }

        await image.SaveAsync(filePath);

        var entity = new ImageEntity
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            Description = request.Description,
            FileName = fileName,
            FileUrl = $"/uploads/{fileName}",
            FileSize = request.File.Length,
            Width = image.Width,
            Height = image.Height,
            OverlayText = request.OverlayText
        };

        await repository.AddAsync(entity);
        return entity.ToDto();
    }

    public async Task<ImageResponseDto> UpdateMetadataAsync(Guid id, string title, string? description, string? overlayText)
    {
        var entity = await repository.GetByIdAsync(id);

        // Use the Exception instead of returning null
        if (entity == null) throw new ImageNotFoundException(id);

        if (entity.OverlayText != overlayText)
        {
            var fullPath = Path.Combine(env.WebRootPath, entity.FileUrl.TrimStart('/'));
            using var image = await Image.LoadAsync(fullPath);
            ApplyYourCustomOverlay(image, overlayText ?? "");
            await image.SaveAsync(fullPath);
        }

        entity.Title = title;
        entity.Description = description;
        entity.OverlayText = overlayText;

        await repository.UpdateAsync(entity);
        return entity.ToDto();
    }

    public async Task DeleteAsync(Guid id)
    {
        var entity = await repository.GetByIdAsync(id);

        // Use the Exception instead of returning false
        if (entity == null) throw new ImageNotFoundException(id);

        var filePath = Path.Combine(env.WebRootPath, entity.FileUrl.TrimStart('/'));
        if (File.Exists(filePath)) File.Delete(filePath);

        await repository.DeleteAsync(id);
    }

    // --- YOUR INTEGRATED LOGIC ---

    private void ApplyYourCustomOverlay(Image image, string text)
    {
        // Your Scaling Logic
        var fontSize = image.Width / 15;

        // Your Font Fallback Logic
        Font font;
        if (SystemFonts.Collection.TryGet("Arial", out var family))
        {
            font = family.CreateFont(fontSize, FontStyle.Bold);
        }
        else
        {
            font = SystemFonts.Collection.Families.First().CreateFont(fontSize, FontStyle.Bold);
        }

        // Your RichTextOptions (Alignment & Wrapping)
        var options = new RichTextOptions(font)
        {
            HorizontalAlignment = HorizontalAlignment.Center,
            VerticalAlignment = VerticalAlignment.Bottom,
            WrappingLength = image.Width - 40,
            Origin = new PointF(image.Width / 2f, image.Height - 20)
        };

        image.Mutate(x => {
            // Your Readability Shadow (Step 1: Black)
            var shadowOptions = new RichTextOptions(options)
            {
                Origin = new PointF(options.Origin.X + 2, options.Origin.Y + 2)
            };
            x.DrawText(shadowOptions, text, Color.Black);

            // Your Main Text (Step 2: White)
            x.DrawText(options, text, Color.White);
        });
    }

    private bool IsValidImage(Stream stream)
    {
        var buffer = new byte[8];

        // We assign the return value to 'read' to satisfy the compiler
        int bytesRead = stream.Read(buffer, 0, 8);

        // Reset position for the next thing that needs to read this stream (ImageSharp)
        stream.Position = 0;

        // Safety: If we couldn't even read 2 bytes, it's definitely not a valid image
        if (bytesRead < 2) return false;

        return (buffer[0] == 0xFF && buffer[1] == 0xD8) || // JPG
               (buffer[0] == 0x89 && buffer[1] == 0x50);   // PNG
    }

}