using ImageOverlay.Api.Entities;
using ImageOverlay.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace ImageOverlay.Api.Repositories;

public class ImageRepository(AppDbContext context) : IImageRepository
{

    public async Task<IEnumerable<ImageEntity>> GetAllAsync() =>
    await context.Images.OrderByDescending(i => i.CreatedAt).ToListAsync();

    public async Task<ImageEntity?> GetByIdAsync(Guid id) =>
        await context.Images.FindAsync(id);

    public async Task AddAsync(ImageEntity image)
    {
        await context.Images.AddAsync(image);
        await context.SaveChangesAsync();
    }

    public async Task UpdateAsync(ImageEntity image)
    {
        context.Images.Update(image);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var image = await GetByIdAsync(id);
        if (image != null)
        {
            context.Images.Remove(image);
            await context.SaveChangesAsync();
        }
    }
}