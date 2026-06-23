namespace XRayFractureDetection.BusinessLogic.DTOs.Responses;

public class DetectionResultDto
{
    public bool IsFracture { get; set; }
    public float Confidence { get; set; }
    public float X { get; set; }
    public float Y { get; set; }
    public float Width { get; set; }
    public float Height { get; set; }
}