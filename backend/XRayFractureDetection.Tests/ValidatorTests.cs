using XRayFractureDetection.BusinessLogic.DTOs.Requests;
using XRayFractureDetection.BusinessLogic.Validators;

namespace XRayFractureDetection.Tests;

public class ValidatorTests
{
    private readonly AnalyzeImageRequestValidator _validator = new();

    private static AnalyzeImageRequest ValidRequest() => new()
    {
        FileName = "xray.jpg",
        FileSizeBytes = 1024,
        ContentType = "image/jpeg",
        ImageStream = new MemoryStream(new byte[1024])
    };

    // Test 9 — коректний запит проходить валідацію без помилок
    [Fact]
    public void Validate_WhenRequestIsValid_PassesValidation()
    {
        // Arrange
        var request = ValidRequest();

        // Act
        var result = _validator.Validate(request);

        // Assert
        Assert.True(result.IsValid);
    }

    // Test 10 — порожнє ім'я файлу → валідація не проходить з повідомленням про FileName
    [Fact]
    public void Validate_WhenFileNameIsEmpty_FailsWithFileNameError()
    {
        // Arrange
        var request = ValidRequest();
        request.FileName = "";

        // Act
        var result = _validator.Validate(request);

        // Assert
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == "FileName");
    }
}
