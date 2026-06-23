using XRayFractureDetection.Domain.Enums;


namespace XRayFractureDetection.Domain.Entities;

public class AnalysisRequest
{
    public Guid Id { get; set; }
    public string ImageHash { get; set; } = default!;
    public string ImageFileName { get; set; } = default!;
    public AnalysisStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public ICollection<DetectionResult> DetectionResults { get; set; } = new List<DetectionResult>();
}