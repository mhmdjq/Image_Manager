using Microsoft.EntityFrameworkCore;
using ImageOverlay.Api.Entities;

namespace ImageOverlay.Api.Data;

public class AppDbContext : DbContext
{
	public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
	public DbSet<ImageEntity> Images => Set<ImageEntity>();
}