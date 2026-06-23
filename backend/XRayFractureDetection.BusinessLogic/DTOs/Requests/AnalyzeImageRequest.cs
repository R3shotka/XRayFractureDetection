namespace XRayFractureDetection.BusinessLogic.DTOs.Requests;

public class AnalyzeImageRequest
{
    public Stream ImageStream { get; set; } = default!;
    public string FileName { get; set; }  = default!;
    public long FileSizeBytes { get; set; }
    public string ContentType { get; set; }   = default!;
}