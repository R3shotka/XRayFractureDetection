using Microsoft.Extensions.Options;
using Microsoft.ML.OnnxRuntime;
using Microsoft.ML.OnnxRuntime.Tensors;
using XRayFractureDetection.BusinessLogic.DTOs.Responses;
using XRayFractureDetection.BusinessLogic.Interfaces.AI;
using XRayFractureDetection.WebAPI.Options;

namespace XRayFractureDetection.WebAPI.Infrastructure.AI;

public class OnnxInferenceService : IInferenceService, IDisposable
{
    private readonly InferenceSession _session;
    private readonly ImagePreprocessor _preprocessor;
    private readonly OnnxOptions _options;
    private readonly string _inputName;
    
    public OnnxInferenceService(
        IOptions<OnnxOptions> options, ImagePreprocessor preprocessor)
    {
        _options = options.Value;
        _preprocessor = preprocessor;

        if (!File.Exists(_options.ModelPath))
            throw new FileNotFoundException(
                "ONNX-модель не знайдено.", _options.ModelPath);

        _session = new InferenceSession(_options.ModelPath);
        _inputName = _session.InputMetadata.Keys.First();
    }
    
    public async Task<IReadOnlyList<DetectionResultDto>> RunAsync(
        Stream imageStream, CancellationToken ct = default)
    {
        var pre = await _preprocessor.PreprocessAsync(
            imageStream, _options.InputSize, ct);

        var inputs = new List<NamedOnnxValue>
        {
            NamedOnnxValue.CreateFromTensor(_inputName, pre.Tensor)
        };

        using var results = _session.Run(inputs);
        var output = results.First().AsTensor<float>();

        return ParseAndFilter(output, pre);
    }
    
    private IReadOnlyList<DetectionResultDto> ParseAndFilter(
        Tensor<float> output, ImagePreprocessor.PreprocessResult pre)
    {
        // Output форма YOLOv8 (1 клас): [1, 5, 8400]
        // рядки: 0=xCenter 1=yCenter 2=width 3=height 4=confidence
        int boxCount = output.Dimensions[2];
        var raw = new List<DetectionResultDto>();

        for (int i = 0; i < boxCount; i++)
        {
            float confidence = output[0, 4, i];
            if (confidence < 0.05f) continue; // широкий поріг до NMS

            float xCenter = output[0, 0, i];
            float yCenter = output[0, 1, i];
            float width = output[0, 2, i];
            float height = output[0, 3, i];

            // Назад у простір оригіналу (зняти pad і scale)
            float absX = (xCenter - width / 2f - pre.PadX) / pre.Scale;
            float absY = (yCenter - height / 2f - pre.PadY) / pre.Scale;
            float absW = width / pre.Scale;
            float absH = height / pre.Scale;

            if (absW <= 0 || absH <= 0) continue;

            // У відносні координати 0..1
            raw.Add(new DetectionResultDto
            {
                IsFracture = true,
                Confidence = confidence,
                X = absX / pre.OriginalWidth,
                Y = absY / pre.OriginalHeight,
                Width = absW / pre.OriginalWidth,
                Height = absH / pre.OriginalHeight
            });
        }

        return ApplyNms(raw);
    }
    
    private List<DetectionResultDto> ApplyNms(List<DetectionResultDto> boxes)
    {
        var sorted = boxes
            .Where(b => b.Confidence >= _options.ConfidenceThreshold)
            .OrderByDescending(b => b.Confidence)
            .ToList();

        var kept = new List<DetectionResultDto>();
        foreach (var box in sorted)
        {
            bool overlaps = kept.Any(k =>
                CalculateIou(box, k) > _options.IouThreshold);
            if (!overlaps) kept.Add(box);
        }
        return kept;
    }
    private static float CalculateIou(DetectionResultDto a, DetectionResultDto b)
    {
        float x1 = Math.Max(a.X, b.X);
        float y1 = Math.Max(a.Y, b.Y);
        float x2 = Math.Min(a.X + a.Width, b.X + b.Width);
        float y2 = Math.Min(a.Y + a.Height, b.Y + b.Height);

        float iw = Math.Max(0, x2 - x1);
        float ih = Math.Max(0, y2 - y1);
        float intersection = iw * ih;
        if (intersection <= 0) return 0;

        float areaA = a.Width * a.Height;
        float areaB = b.Width * b.Height;
        return intersection / (areaA + areaB - intersection);
    }

    public void Dispose() => _session.Dispose();
}