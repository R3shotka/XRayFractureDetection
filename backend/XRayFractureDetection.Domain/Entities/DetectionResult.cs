namespace XRayFractureDetection.Domain.Entities;

public class DetectionResult
{
    public Guid Id { get; set; }
    public Guid AnalysisRequestId { get; set; }
    public float Confidence { get; set; }
    public float BoundingBoxX { get; set; }
    public float BoundingBoxY { get; set; }
    public float BoundingBoxWidth { get; set; }
    public float BoundingBoxHeight { get; set; }
    public bool IsFracture { get; set; }
    
    // Navigation property
    public AnalysisRequest AnalysisRequest { get; set; } = null!;
}