using Moq;
using XRayFractureDetection.BusinessLogic.DTOs.Requests;
using XRayFractureDetection.BusinessLogic.DTOs.Responses;
using XRayFractureDetection.BusinessLogic.Interfaces.AI;
using XRayFractureDetection.BusinessLogic.Services;
using XRayFractureDetection.Domain.Entities;
using XRayFractureDetection.Domain.Enums;
using XRayFractureDetection.Domain.Interfaces;

namespace XRayFractureDetection.Tests;

public class AnalysisServiceTests
{
    private readonly Mock<IAnalysisRequestRepository> _requestRepoMock = new();
    private readonly Mock<IDetectionResultRepository> _detectionRepoMock = new();
    private readonly Mock<IInferenceService> _inferenceMock = new();
    private readonly Mock<IUnitOfWork> _unitOfWorkMock = new();
    private readonly AnalysisService _sut;

    public AnalysisServiceTests()
    {
        _requestRepoMock
            .Setup(r => r.AddAsync(It.IsAny<AnalysisRequest>(), It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        _detectionRepoMock
            .Setup(r => r.AddRangeAsync(It.IsAny<IEnumerable<DetectionResult>>(), It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        _unitOfWorkMock
            .Setup(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        _sut = new AnalysisService(
            _requestRepoMock.Object,
            _detectionRepoMock.Object,
            _inferenceMock.Object,
            _unitOfWorkMock.Object);
    }

    private static AnalyzeImageRequest CreateRequest() => new()
    {
        ImageStream = new MemoryStream(new byte[] { 0xFF, 0xD8, 0xFF }),
        FileName = "xray.jpg",
        FileSizeBytes = 3,
        ContentType = "image/jpeg"
    };

    // Test 1 — інференс повертає порожній список → відповідь без детекцій
    [Fact]
    public async Task AnalyzeAsync_WhenInferenceReturnsNoDetections_ReturnsEmptyDetectionList()
    {
        // Arrange
        _inferenceMock
            .Setup(i => i.RunAsync(It.IsAny<Stream>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<DetectionResultDto>());

        // Act
        var result = await _sut.AnalyzeAsync(CreateRequest());

        // Assert
        Assert.NotNull(result);
        Assert.Empty(result.Detections);
    }

    // Test 2 — інференс повертає 2 детекції → у відповіді 2 об'єкти
    [Fact]
    public async Task AnalyzeAsync_WhenInferenceReturnsTwoDetections_ResponseContainsTwoDetections()
    {
        // Arrange
        var detections = new List<DetectionResultDto>
        {
            new() { IsFracture = true, Confidence = 0.85f, X = 0.1f, Y = 0.2f, Width = 0.1f, Height = 0.1f },
            new() { IsFracture = true, Confidence = 0.70f, X = 0.5f, Y = 0.5f, Width = 0.1f, Height = 0.1f }
        };

        _inferenceMock
            .Setup(i => i.RunAsync(It.IsAny<Stream>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(detections);

        // Act
        var result = await _sut.AnalyzeAsync(CreateRequest());

        // Assert
        Assert.Equal(2, result.Detections.Count);
    }

    // Test 3 — інференс кидає виняток → статус запиту стає Failed
    [Fact]
    public async Task AnalyzeAsync_WhenInferenceThrows_StatusIsSetToFailed()
    {
        // Arrange
        AnalysisRequest? capturedRequest = null;

        _requestRepoMock
            .Setup(r => r.AddAsync(It.IsAny<AnalysisRequest>(), It.IsAny<CancellationToken>()))
            .Callback<AnalysisRequest, CancellationToken>((req, _) => capturedRequest = req)
            .Returns(Task.CompletedTask);

        _inferenceMock
            .Setup(i => i.RunAsync(It.IsAny<Stream>(), It.IsAny<CancellationToken>()))
            .ThrowsAsync(new Exception("Model error"));

        // Act
        await Assert.ThrowsAsync<Exception>(() => _sut.AnalyzeAsync(CreateRequest()));

        // Assert
        Assert.NotNull(capturedRequest);
        Assert.Equal(AnalysisStatus.Failed, capturedRequest!.Status);
    }

    // Test 4 — інференс кидає виняток → він пробрасується назовні (не ковтається)
    [Fact]
    public async Task AnalyzeAsync_WhenInferenceThrows_ExceptionIsPropagated()
    {
        // Arrange
        _inferenceMock
            .Setup(i => i.RunAsync(It.IsAny<Stream>(), It.IsAny<CancellationToken>()))
            .ThrowsAsync(new InvalidOperationException("Model crashed"));

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(
            () => _sut.AnalyzeAsync(CreateRequest()));
    }

    // Test 5 — успішний аналіз → SaveChanges викликається рівно один раз
    [Fact]
    public async Task AnalyzeAsync_WhenSuccessful_SaveChangesCalledExactlyOnce()
    {
        // Arrange
        _inferenceMock
            .Setup(i => i.RunAsync(It.IsAny<Stream>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<DetectionResultDto>());

        // Act
        await _sut.AnalyzeAsync(CreateRequest());

        // Assert
        _unitOfWorkMock.Verify(
            u => u.SaveChangesAsync(It.IsAny<CancellationToken>()),
            Times.Once);
    }

    // Test 6 — GetResultAsync з неіснуючим id → повертає null
    [Fact]
    public async Task GetResultAsync_WhenRequestDoesNotExist_ReturnsNull()
    {
        // Arrange
        var nonExistentId = Guid.NewGuid();

        _requestRepoMock
            .Setup(r => r.GetByIdAsync(nonExistentId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((AnalysisRequest?)null);

        // Act
        var result = await _sut.GetResultAsync(nonExistentId);

        // Assert
        Assert.Null(result);
    }
}
