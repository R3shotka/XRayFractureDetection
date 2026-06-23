using XRayFractureDetection.Domain.Entities;

namespace XRayFractureDetection.Domain.Interfaces;

public interface IDetectionResultRepository
{
    Task<IReadOnlyList<DetectionResult>> GetByRequestIdAsync(Guid requestId, CancellationToken ct = default);
    Task AddRangeAsync(IEnumerable<DetectionResult> results, CancellationToken ct = default);
}
