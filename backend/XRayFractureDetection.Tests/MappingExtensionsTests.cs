using XRayFractureDetection.BusinessLogic.Mapping;
using XRayFractureDetection.Domain.Entities;
using XRayFractureDetection.Domain.Enums;

namespace XRayFractureDetection.Tests;

public class MappingExtensionsTests
{
    // Test 7 — ToDto правильно маппить всі поля з entity в DTO
    [Fact]
    public void ToDto_MapsAllFieldsCorrectly()
    {
        // Arrange
        var entity = new DetectionResult
        {
            Id = Guid.NewGuid(),
            IsFracture = true,
            Confidence = 0.87f,
            BoundingBoxX = 0.10f,
            BoundingBoxY = 0.20f,
            BoundingBoxWidth = 0.30f,
            BoundingBoxHeight = 0.40f
        };

        // Act
        var dto = entity.ToDto();

        // Assert
        Assert.True(dto.IsFracture);
        Assert.Equal(0.87f, dto.Confidence);
        Assert.Equal(0.10f, dto.X);
        Assert.Equal(0.20f, dto.Y);
        Assert.Equal(0.30f, dto.Width);
        Assert.Equal(0.40f, dto.Height);
    }

    // Test 8 — ToResponse правильно маппить Id, Status, CreatedAt
    [Fact]
    public void ToResponse_MapsIdStatusAndCreatedAtCorrectly()
    {
        // Arrange
        var id = Guid.NewGuid();
        var createdAt = new DateTime(2025, 6, 1, 12, 0, 0, DateTimeKind.Utc);

        var entity = new AnalysisRequest
        {
            Id = id,
            ImageHash = "abc123",
            ImageFileName = "scan.jpg",
            Status = AnalysisStatus.Completed,
            CreatedAt = createdAt,
            DetectionResults = new List<DetectionResult>()
        };

        // Act
        var response = entity.ToResponse();

        // Assert
        Assert.Equal(id, response.RequestId);
        Assert.Equal(AnalysisStatus.Completed, response.Status);
        Assert.Equal(createdAt, response.CreatedAt);
    }
}
