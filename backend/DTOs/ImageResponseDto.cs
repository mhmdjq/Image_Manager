namespace ImageOverlay.Api.DTOs;

public record ImageResponseDto(

    Guid Id,

    string Title,

    string? Description,

    string FileUrl,

    string FileName,

    long FileSize,

    int Width,

    int Height,

    string? OverlayText,

    DateTime CreatedAt

);