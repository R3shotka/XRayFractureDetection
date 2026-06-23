namespace XRayFractureDetection.WebAPI.Options;

public class OnnxOptions
{
    public const string SectionName = "Onnx";
    public string ModelPath { get; set; } = default!;
    public float ConfidenceThreshold { get; set; } = 0.25f; 
    public float IouThreshold { get; set; } = 0.45f;
    public int InputSize { get; set; } = 640;
}