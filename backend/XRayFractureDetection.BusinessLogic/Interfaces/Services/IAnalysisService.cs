using XRayFractureDetection.BusinessLogic.DTOs.Requests;
using XRayFractureDetection.BusinessLogic.DTOs.Responses;

namespace XRayFractureDetection.BusinessLogic.Interfaces.Services;

public interface IAnalysisService
{
    Task<AnalysisResultResponse> AnalyzeAsync(AnalyzeImageRequest request, CancellationToken ct = default);
    Task<AnalysisResultResponse?> GetResultAsync(Guid requestId, CancellationToken ct = default);
}