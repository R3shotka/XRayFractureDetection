using FluentValidation;
using Microsoft.EntityFrameworkCore;
using XRayFractureDetection.BusinessLogic.DTOs.Requests;
using XRayFractureDetection.BusinessLogic.Interfaces.AI;
using XRayFractureDetection.BusinessLogic.Interfaces.Services;
using XRayFractureDetection.BusinessLogic.Services;
using XRayFractureDetection.BusinessLogic.Validators;
using XRayFractureDetection.DataAccess.Context;
using XRayFractureDetection.DataAccess.Repositories;
using XRayFractureDetection.Domain.Interfaces;
using XRayFractureDetection.DataAccess;
using XRayFractureDetection.WebAPI.Infrastructure.AI;
using XRayFractureDetection.WebAPI.Middleware;
using XRayFractureDetection.WebAPI.Options;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

// Onnx конфігурація
builder.Services.Configure<OnnxOptions>(
    builder.Configuration.GetSection(OnnxOptions.SectionName));

// База даних
var connectionString = builder.Configuration.GetConnectionString("Default")!;
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// Репозиторії та UnitOfWork
builder.Services.AddScoped<IAnalysisRequestRepository, AnalysisRequestRepository>();
builder.Services.AddScoped<IDetectionResultRepository, DetectionResultRepository>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// Сервіси
builder.Services.AddScoped<IAnalysisService, AnalysisService>();
builder.Services.AddSingleton<ImagePreprocessor>();
builder.Services.AddSingleton<IInferenceService, OnnxInferenceService>();

builder.Services.AddScoped<IValidator<AnalyzeImageRequest>, AnalyzeImageRequestValidator>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

builder.Services.AddHealthChecks()
    .AddDbContextCheck<AppDbContext>("database");

var app = builder.Build();

app.UseMiddleware<GlobalExceptionMiddleware>();
app.UseCors("AllowFrontend");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();
app.MapControllers();
app.MapHealthChecks("/health");

app.Run();
