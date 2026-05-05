using ImageOverlay.Api.DTOs;
using ImageOverlay.Api.Services;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ImagesController(IImageService imageService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await imageService.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id) => Ok(await imageService.GetByIdAsync(id));

    [HttpPost]
    public async Task<IActionResult> Upload([FromForm] ImageUploadRequest request) =>
        Ok(await imageService.UploadAsync(request));

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMetadata(Guid id, [FromBody] UpdateMetadataRequest request) =>
        Ok(await imageService.UpdateMetadataAsync(id, request.Title, request.Description, request.OverlayText));

    [HttpPost("{id}/overlay")]
    public async Task<IActionResult> GenerateOverlay(Guid id)
    {
        // GetByIdAsync will throw 404 if not found, so no null check needed!
        var image = await imageService.GetByIdAsync(id);

        if (string.IsNullOrEmpty(image.OverlayText))
            return BadRequest("This image has no overlay text defined.");

        var result = await imageService.UpdateMetadataAsync(id, image.Title, image.Description, image.OverlayText);
        return Ok(new { url = result.FileUrl });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await imageService.DeleteAsync(id);
        return NoContent(); // 204 No Content is the standard for successful deletes
    }
}