using System.Security.Cryptography;
using XRayFractureDetection.BusinessLogic.DTOs.Requests;
using XRayFractureDetection.BusinessLogic.DTOs.Responses;
using XRayFractureDetection.BusinessLogic.Interfaces.AI;
using XRayFractureDetection.BusinessLogic.Interfaces.Services;
using XRayFractureDetection.BusinessLogic.Mapping;
using XRayFractureDetection.Domain.Entities;
using XRayFractureDetection.Domain.Enums;
using XRayFractureDetection.Domain.Interfaces;

namespace XRayFractureDetection.BusinessLogic.Services;

public class AnalysisService : IAnalysisService
{
    private readonly IAnalysisRequestRepository _requestRepo;
    private readonly IDetectionResultRepository _detectionRepo;
    private readonly IInferenceService _inference;
    private readonly IUnitOfWork _unitOfWork;
    
    public AnalysisService(IAnalysisRequestRepository requestRepo, IDetectionResultRepository detectionRepo, IInferenceService inference, IUnitOfWork unitOfWork)
    {
        _requestRepo = requestRepo;
        _detectionRepo = detectionRepo;
        _inference = inference;
        _unitOfWork = unitOfWork;
    }
    
    public async Task<AnalysisResultResponse> AnalyzeAsync(AnalyzeImageRequest request, CancellationToken ct = default)
    {
        // Копіюємо в пам'ять щоб читати двічі
        using var memory = new MemoryStream();
        await request.ImageStream.CopyToAsync(memory, ct);
        memory.Position = 0; // перемотуємо на початок
        
        var hash = await ComputeHashAsync(memory, ct);
        memory.Position = 0; // знову на початок — для інференсу
        
        var analysisRequest = new AnalysisRequest
        {
            Id = Guid.NewGuid(),
            ImageHash = hash,
            ImageFileName = request.FileName,
            Status = AnalysisStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };
        await _requestRepo.AddAsync(analysisRequest, ct);

        IReadOnlyList<DetectionResultDto> detections = new List<DetectionResultDto>();
        try
        {
            detections = await _inference.RunAsync(memory, ct);

            // Перетворюємо DTO інференсу в entity БД
            var entities = detections.Select(d => new DetectionResult
            {
                Id = Guid.NewGuid(),
                AnalysisRequestId = analysisRequest.Id,
                IsFracture = d.IsFracture,
                Confidence = d.Confidence,
                BoundingBoxX = d.X,
                BoundingBoxY = d.Y,
                BoundingBoxWidth = d.Width,
                BoundingBoxHeight = d.Height
            }).ToList();

            await _detectionRepo.AddRangeAsync(entities, ct);

            // Оновлюємо статус
            analysisRequest.Status = AnalysisStatus.Completed;

            // Один коміт — всі зміни однією транзакцією
            await _unitOfWork.SaveChangesAsync(ct);
        }
        catch
        {
            analysisRequest.Status = AnalysisStatus.Failed;
            await _unitOfWork.SaveChangesAsync(ct);
            throw; // прокидаємо далі — не ковтаємо помилку
        }
        
        var result = analysisRequest.ToResponse();
        result.Detections = detections.ToList();
        return result;
    }
    
    private static async Task<string> ComputeHashAsync(Stream stream, CancellationToken ct)
    {
        using var sha = SHA256.Create();
        var bytes = await sha.ComputeHashAsync(stream, ct);
        return Convert.ToHexString(bytes).ToLowerInvariant();
    }

    public async Task<AnalysisResultResponse?> GetResultAsync(
        Guid requestId, CancellationToken ct = default)
    {
        var request = await _requestRepo.GetByIdAsync(requestId, ct);
        return request?.ToResponse();
    }
}