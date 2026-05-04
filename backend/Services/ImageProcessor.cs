using SixLabors.Fonts;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Drawing.Processing;
using SixLabors.ImageSharp.Processing;
using System.IO;

namespace ImageOverlay.Api.Services;

public class ImageProcessor
{
	private readonly IWebHostEnvironment _environment;

	public ImageProcessor(IWebHostEnvironment environment)
	{
		_environment = environment;
	}

	public void ApplyOverlay(string fileName, string text)
	{
		var inputPath = Path.Combine(_environment.WebRootPath, "uploads", fileName);
		var outputPath = Path.Combine(_environment.WebRootPath, "uploads", "overlay_" + fileName);

		using var image = SixLabors.ImageSharp.Image.Load(inputPath);

		// Scale font size based on image width (approx 1/15th of width)
		var fontSize = image.Width / 15;

		SixLabors.Fonts.Font font;
		if (SystemFonts.Collection.TryGet("Arial", out var family))
		{
			font = family.CreateFont(fontSize, SixLabors.Fonts.FontStyle.Bold);
		}
		else
		{
			font = SystemFonts.Collection.Families.First().CreateFont(fontSize, SixLabors.Fonts.FontStyle.Bold);
		}

		// NEW: Text Options for Wrapping and Alignment
		var options = new RichTextOptions(font)
		{
			HorizontalAlignment = HorizontalAlignment.Center,
			VerticalAlignment = VerticalAlignment.Bottom,
			WrappingLength = image.Width - 40, // Padding from sides
			Origin = new PointF(image.Width / 2, image.Height - 20) // Bottom center
		};

		image.Mutate(x => {
			// 1. Draw a dark shadow/outline for readability
			var shadowOptions = new RichTextOptions(options)
			{
				Origin = new PointF(options.Origin.X + 2, options.Origin.Y + 2)
			};
			x.DrawText(shadowOptions, text, SixLabors.ImageSharp.Color.Black);

			// 2. Draw the main text
			x.DrawText(options, text, SixLabors.ImageSharp.Color.White);
		});

		image.Save(outputPath);
	}
}