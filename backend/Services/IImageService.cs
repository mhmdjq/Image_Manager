using ImageOverlay.Api.DTOs;

namespace ImageOverlay.Api.Services;

public interface IImageService
{
    Task<IEnumerable<ImageResponseDto>> GetAllAsync();

    Task<ImageResponseDto> GetByIdAsync(Guid id);

    Task<ImageResponseDto> UploadAsync(ImageUploadRequest request);

    Task<ImageResponseDto> UpdateMetadataAsync(Guid id, string title, string? description, string? overlayText);

    Task DeleteAsync(Guid id);

}