using XRayFractureDetection.BusinessLogic.DTOs.Responses;
using XRayFractureDetection.Domain.Entities;

namespace XRayFractureDetection.BusinessLogic.Mapping;

public static class MappingExtensions
{
    public static DetectionResultDto ToDto(this DetectionResult entity)
    {
        return new DetectionResultDto()
        {
            IsFracture = entity.IsFracture,
            Confidence = entity.Confidence,
            X = entity.BoundingBoxX,
            Y = entity.BoundingBoxY,
            Width = entity.BoundingBoxWidth,
            Height = entity.BoundingBoxHeight
        };
    }

    public static AnalysisResultResponse ToResponse(this AnalysisRequest entity)
    {
        return new AnalysisResultResponse()
        {
            RequestId = entity.Id,
            Status = entity.Status,
            CreatedAt = entity.CreatedAt,
            Detections = entity.DetectionResults.Select(dr => dr.ToDto()).ToList()
        };
    }
}