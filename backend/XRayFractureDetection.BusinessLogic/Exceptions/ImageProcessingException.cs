namespace XRayFractureDetection.BusinessLogic.Exceptions;

public class ImageProcessingException : Exception
{
    public ImageProcessingException(string message)
        : base(message)
    {
        
    }
    
    public ImageProcessingException(string message, Exception inner)
        : base(message, inner)
    {
        
    }
}