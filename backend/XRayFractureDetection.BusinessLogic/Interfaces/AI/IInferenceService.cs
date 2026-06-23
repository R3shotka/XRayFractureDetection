using XRayFractureDetection.BusinessLogic.DTOs.Responses;

namespace XRayFractureDetection.BusinessLogic.Interfaces.AI;

public interface IInferenceService
{
    Task<IReadOnlyList<DetectionResultDto>> RunAsync(Stream imageStream, CancellationToken ct = default);
}