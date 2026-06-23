using XRayFractureDetection.Domain.Entities;

namespace XRayFractureDetection.Domain.Interfaces;

public interface IAnalysisRequestRepository
{
    Task<AnalysisRequest?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task AddAsync(AnalysisRequest request, CancellationToken ct = default);
}
