using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using XRayFractureDetection.BusinessLogic.DTOs.Requests;
using XRayFractureDetection.BusinessLogic.DTOs.Responses;
using XRayFractureDetection.BusinessLogic.Interfaces.Services;

namespace XRayFractureDetection.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnalysisController : ControllerBase
{
    private readonly IAnalysisService _service;
    private readonly IValidator<AnalyzeImageRequest> _validator;
    public AnalysisController(IAnalysisService service, IValidator<AnalyzeImageRequest> validator)
    {
        _service = service;
        _validator = validator;
    }
    
    [HttpPost("analyze")]
    [RequestSizeLimit(20 * 1024 * 1024)]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<AnalysisResultResponse>> Analyze(
        IFormFile image, CancellationToken ct)
    {
        // Розпаковуємо IFormFile у платформо-незалежний запит
        await using var stream = image.OpenReadStream();
        var request = new AnalyzeImageRequest
        {
            ImageStream = stream,
            FileName = image.FileName,
            FileSizeBytes = image.Length,
            ContentType = image.ContentType
        };

        var validation = await _validator.ValidateAsync(request, ct);
        if (!validation.IsValid)
            return BadRequest(validation.ToDictionary());

        var result = await _service.AnalyzeAsync(request, ct);
        return Ok(result);
    }
    
    [HttpGet("{requestId:guid}")]
    public async Task<ActionResult<AnalysisResultResponse>> GetResult(
        Guid requestId, CancellationToken ct)
    {
        var result = await _service.GetResultAsync(requestId, ct);
        return result is null ? NotFound() : Ok(result);
    }
}