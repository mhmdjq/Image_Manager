namespace ImageOverlay.Api.Exceptions;

public class ImageNotFoundException(Guid id)
    : Exception($"Image with ID {id} was not found.");