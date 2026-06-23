using XRayFractureDetection.Domain.Enums;

namespace XRayFractureDetection.BusinessLogic.DTOs.Responses;

public class AnalysisResultResponse
{
    public Guid RequestId { get; set; }
    public AnalysisStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public IReadOnlyList<DetectionResultDto> Detections { get; set; } = new List<DetectionResultDto>();
}