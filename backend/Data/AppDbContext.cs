using Microsoft.EntityFrameworkCore;
using ImageOverlay.Api.Models;

namespace ImageOverlay.Api.Data;

public class AppDbContext : DbContext
{
	public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
	public DbSet<ImageRecord> Images => Set<ImageRecord>();
}