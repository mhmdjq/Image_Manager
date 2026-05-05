namespace ImageOverlay.Api.DTOs;

public record UpdateMetadataRequest(

    string Title,

    string? Description,

    string? OverlayText

);