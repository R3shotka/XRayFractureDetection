using FluentValidation;
using XRayFractureDetection.BusinessLogic.DTOs.Requests;

namespace XRayFractureDetection.BusinessLogic.Validators;

public class AnalyzeImageRequestValidator : AbstractValidator<AnalyzeImageRequest>
{
    private const long FileSizeBytes = 20 * 1024 * 1024; // 20 MB
    private static readonly string[] AllowedContentTypes =
        ["image/jpeg", "image/png", "image/bmp"];

    public AnalyzeImageRequestValidator()
    {
        RuleFor(x => x.FileSizeBytes).GreaterThan(0).WithMessage("File is empty.")
            .LessThanOrEqualTo(20 * 1024 * 1024).WithMessage("File is too large");

        RuleFor(x => x.ContentType).Must(contentType => AllowedContentTypes.Contains(contentType))
            .WithMessage("Content type is not allowed. Use only JPEG, PNG, BMP.");

        RuleFor(x => x.FileName).NotEmpty().WithMessage("File name is empty.");

    }
}