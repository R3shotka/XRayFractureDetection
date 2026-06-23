using Microsoft.ML.OnnxRuntime.Tensors;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace XRayFractureDetection.WebAPI.Infrastructure.AI;

public class ImagePreprocessor
{
    public record PreprocessResult(
        DenseTensor<float> Tensor,
        int OriginalWidth,
        int OriginalHeight,
        float Scale,
        int PadX,
        int PadY);

    public async Task<PreprocessResult> PreprocessAsync(Stream imageStream, int inputSize, CancellationToken ct)
    {
        using var image = await Image.LoadAsync<Rgb24>(imageStream, ct);
        
        int originalWidth = image.Width;
        int originalHeight = image.Height;
        
        float scale = Math.Min(
            (float)inputSize / originalWidth,
            (float)inputSize / originalHeight);
        
        int newWidth = (int)(originalWidth * scale);
        int newHeight = (int)(originalHeight * scale);
        int padX = (inputSize - newWidth) / 2;
        int padY = (inputSize - newHeight) / 2;
        
        image.Mutate(ctx => ctx.Resize(new ResizeOptions
        {
            Size = new Size(inputSize, inputSize),
            Mode = ResizeMode.Pad,
            PadColor = Color.Black
        }));
        
        var tensor = new DenseTensor<float>(new[] { 1, 3, inputSize, inputSize });
        
        image.ProcessPixelRows(accessor =>
        {
            for (int y = 0; y < inputSize; y++)
            {
                var row = accessor.GetRowSpan(y);
                for (int x = 0; x < inputSize; x++)
                {
                    tensor[0, 0, y, x] = row[x].R / 255f; // R канал
                    tensor[0, 1, y, x] = row[x].G / 255f; // G канал
                    tensor[0, 2, y, x] = row[x].B / 255f; // B канал
                }
            }
        });
        
        return new PreprocessResult(
            tensor, originalWidth, originalHeight, scale, padX, padY);
    }
}