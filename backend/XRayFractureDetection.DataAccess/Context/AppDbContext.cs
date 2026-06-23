using Microsoft.EntityFrameworkCore;
using XRayFractureDetection.Domain.Entities;

namespace XRayFractureDetection.DataAccess.Context;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    public DbSet<AnalysisRequest> AnalysisRequests => Set<AnalysisRequest>();
    public DbSet<DetectionResult> DetectionResults => Set<DetectionResult>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<AnalysisRequest>(entity =>
        {
            entity.HasKey(a => a.Id);

            entity.Property(a => a.ImageHash)
                .IsRequired()
                .HasMaxLength(64);

            entity.Property(a => a.ImageFileName)
                .IsRequired()
                .HasMaxLength(260);

            entity.Property(a => a.Status)
                .IsRequired()
                .HasConversion<int>();

            entity.Property(a => a.CreatedAt)
                .IsRequired()
                .HasColumnType("timestamptz");

            entity.HasIndex(a => a.ImageHash);

            entity.HasMany(a => a.DetectionResults)
                .WithOne(d => d.AnalysisRequest)
                .HasForeignKey(d => d.AnalysisRequestId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<DetectionResult>(entity =>
        {
            entity.HasKey(d => d.Id);

            entity.Property(d => d.Confidence).IsRequired();
            entity.Property(d => d.BoundingBoxX).IsRequired();
            entity.Property(d => d.BoundingBoxY).IsRequired();
            entity.Property(d => d.BoundingBoxWidth).IsRequired();
            entity.Property(d => d.BoundingBoxHeight).IsRequired();
            entity.Property(d => d.IsFracture).IsRequired();

            entity.HasIndex(d => d.AnalysisRequestId);
        });

        base.OnModelCreating(builder);
    }
}
