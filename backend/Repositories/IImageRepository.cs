using ImageOverlay.Api.Entities;

namespace ImageOverlay.Api.Repositories;

public interface IImageRepository
{
    Task<IEnumerable<ImageEntity>> GetAllAsync();

    Task<ImageEntity?> GetByIdAsync(Guid id);

    Task AddAsync(ImageEntity image);

    Task UpdateAsync(ImageEntity image);

    Task DeleteAsync(Guid id);

}