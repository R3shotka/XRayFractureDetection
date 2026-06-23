using Microsoft.EntityFrameworkCore;
using XRayFractureDetection.DataAccess.Context;
using XRayFractureDetection.Domain.Entities;
using XRayFractureDetection.Domain.Interfaces;

namespace XRayFractureDetection.DataAccess.Repositories;

public class AnalysisRequestRepository : IAnalysisRequestRepository
{
    private readonly AppDbContext _context;

    public AnalysisRequestRepository(AppDbContext context) => _context = context;

    public async Task<AnalysisRequest?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var request = await _context.AnalysisRequests.Include(r => r.DetectionResults).FirstOrDefaultAsync(r => r.Id == id, ct);
        return request;
    }

    public async Task AddAsync(AnalysisRequest request, CancellationToken ct = default)
    {
        await _context.AnalysisRequests.AddAsync(request, ct);
        
    }
}
