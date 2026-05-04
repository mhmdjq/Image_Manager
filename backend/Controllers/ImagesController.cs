using ImageOverlay.Api.Data;
using ImageOverlay.Api.Models;
using ImageOverlay.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
namespace ImageOverlay.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ImagesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _environment;
    private readonly ImageProcessor _imageProcessor;

    // LOOK CLOSELY HERE: You need all THREE parameters inside the ( )
    public ImagesController(AppDbContext context, IWebHostEnvironment environment, ImageProcessor imageProcessor)
    {
        _context = context;
        _environment = environment;
        _imageProcessor = imageProcessor; // This line was failing because 'imageProcessor' was missing above
    }

    // 1. READ: Get all images
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ImageRecord>>> GetImages()
    {
        return await _context.Images.OrderByDescending(i => i.CreatedAt).ToListAsync();
    }

    // 2. CREATE: Upload an image
    [HttpPost]
    public async Task<IActionResult> UploadImage([FromForm] IFormFile file, [FromForm] string title, [FromForm] string? description)
    {
        if (file == null || file.Length == 0) return BadRequest("No file uploaded.");

        // 1. Create a timestamp (e.g., 20260504_1530)
        string timestamp = DateTime.Now.ToString("yyyyMMdd_HHmm");

        // 2. Sanitize the title: lowercase, no special characters, dashes for spaces
        string safeTitle = string.Concat(title.Where(c => char.IsLetterOrDigit(c) || char.IsWhiteSpace(c)))
                                 .Trim()
                                 .Replace(" ", "-")
                                 .ToLower();

        // 3. Limit title length to keep filenames manageable
        if (safeTitle.Length > 25) safeTitle = safeTitle.Substring(0, 25);

        // Result: "20260504_1530_my-bear-image.jpg"
        var fileName = $"{timestamp}_{safeTitle}{Path.GetExtension(file.FileName)}";

        var path = Path.Combine(_environment.WebRootPath, "uploads", fileName);

        using (var stream = new FileStream(path, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var record = new ImageRecord
        {
            Title = title,
            Description = description,
            FileName = fileName
        };

        _context.Images.Add(record);
        await _context.SaveChangesAsync();

        return Ok(record);
    }

    // 3. UPDATE: Edit Metadata
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMetadata(Guid id, ImageRecord updatedRecord)
    {
        var record = await _context.Images.FindAsync(id);
        if (record == null) return NotFound();

        record.Title = updatedRecord.Title;
        record.Description = updatedRecord.Description;
        record.OverlayText = updatedRecord.OverlayText;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // 4. OVERLAY: Generate version with text
    [HttpPost("{id}/overlay")]
    public async Task<IActionResult> GenerateOverlay(Guid id)
    {
        var image = await _context.Images.FindAsync(id);
        if (image == null || string.IsNullOrEmpty(image.OverlayText))
            return BadRequest("Image or overlay text missing.");

        // 1. Generate the overlay file
        _imageProcessor.ApplyOverlay(image.FileName, image.OverlayText);

        // 2. Persistence Fix: Update the database to use the new file
        // This ensures the overlay stays after a refresh!
        if (!image.FileName.StartsWith("overlay_"))
        {
            image.FileName = "overlay_" + image.FileName;
            await _context.SaveChangesAsync();
        }

        return Ok(new { url = "/uploads/" + image.FileName });
    }

    // 5. DELETE: Remove image
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteImage(Guid id)
    {
        var record = await _context.Images.FindAsync(id);
        if (record == null) return NotFound();

        var path = Path.Combine(_environment.WebRootPath, "uploads", record.FileName);
        if (System.IO.File.Exists(path)) System.IO.File.Delete(path);

        _context.Images.Remove(record);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}