using Microsoft.EntityFrameworkCore;
using XRayFractureDetection.DataAccess.Context;
using XRayFractureDetection.Domain.Entities;
using XRayFractureDetection.Domain.Interfaces;

namespace XRayFractureDetection.DataAccess.Repositories;

public class DetectionResultRepository : IDetectionResultRepository
{
    private readonly AppDbContext _context;

    public DetectionResultRepository(AppDbContext context) => _context = context;

    public async Task<IReadOnlyList<DetectionResult>> GetByRequestIdAsync(Guid requestId, CancellationToken ct = default)
    {
        var results = await _context.DetectionResults.Where(r => r.AnalysisRequestId == requestId).AsNoTracking().ToListAsync(ct);
        return results;
    }

    public async Task AddRangeAsync(IEnumerable<DetectionResult> results, CancellationToken ct = default)
    {
        await _context.DetectionResults.AddRangeAsync(results, ct);
    }
}
