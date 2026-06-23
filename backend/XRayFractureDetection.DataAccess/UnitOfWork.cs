using XRayFractureDetection.DataAccess.Context;
using XRayFractureDetection.Domain.Interfaces;

namespace XRayFractureDetection.DataAccess;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;

    public UnitOfWork(AppDbContext context) => _context = context;

    public async Task<int> SaveChangesAsync(CancellationToken ct = default)
        => await _context.SaveChangesAsync(ct);
}
