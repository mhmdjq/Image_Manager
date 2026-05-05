using ImageOverlay.Api.Entities;
using ImageOverlay.Api.DTOs;

namespace ImageOverlay.Api.Mappers;

public static class ImageMapper
{

    public static ImageResponseDto ToDto(this ImageEntity entity)
    {
        return new ImageResponseDto(

            entity.Id,

            entity.Title,

            entity.Description,

            entity.FileUrl,

            entity.FileName,

            entity.FileSize,

            entity.Width,

            entity.Height,

            entity.OverlayText,

            entity.CreatedAt
        );
    }
}