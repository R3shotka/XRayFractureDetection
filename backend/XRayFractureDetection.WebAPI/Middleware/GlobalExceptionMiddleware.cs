using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using XRayFractureDetection.BusinessLogic.Exceptions;

namespace XRayFractureDetection.WebAPI.Middleware;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(
        RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ImageProcessingException ex)
        {
            await WriteProblem(context, StatusCodes.Status422UnprocessableEntity,
                "Помилка обробки зображення", ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Необроблений виняток");
            await WriteProblem(context, StatusCodes.Status500InternalServerError,
                "Внутрішня помилка сервера",
                "Сталася непередбачена помилка.");
        }
    }

    private static async Task WriteProblem(
        HttpContext context, int status, string title, string detail)
    {
        var problem = new ProblemDetails
        {
            Status = status,
            Title = title,
            Detail = detail,
            Type = "https://tools.ietf.org/html/rfc7807"
        };
        problem.Extensions["traceId"] = context.TraceIdentifier;

        context.Response.StatusCode = status;
        context.Response.ContentType = "application/problem+json";
        await context.Response.WriteAsync(
            JsonSerializer.Serialize(problem));
    }
}