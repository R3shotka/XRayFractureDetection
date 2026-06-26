# ── Стадія 1: збірка ────────────────────────────────────────────
# Беремо повний SDK щоб зробити dotnet publish
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Копіюємо всі .csproj файли і відновлюємо залежності
# Робимо це окремо від коду — щоб Docker кешував цей шар
# і не качав пакети заново при кожній зміні коду
COPY XRayFractureDetection.Domain/XRayFractureDetection.Domain.csproj                         XRayFractureDetection.Domain/
COPY XRayFractureDetection.BusinessLogic/XRayFractureDetection.BusinessLogic.csproj           XRayFractureDetection.BusinessLogic/
COPY XRayFractureDetection.DataAccess/XRayFractureDetection.DataAccess.csproj                 XRayFractureDetection.DataAccess/
COPY XRayFractureDetection.WebAPI/XRayFractureDetection.WebAPI.csproj                         XRayFractureDetection.WebAPI/
RUN dotnet restore XRayFractureDetection.WebAPI/XRayFractureDetection.WebAPI.csproj

# Копіюємо весь код і публікуємо
COPY . .
RUN dotnet publish XRayFractureDetection.WebAPI/XRayFractureDetection.WebAPI.csproj \
    -c Release -o /app/publish

# ── Стадія 2: фінальний образ ────────────────────────────────────
# Беремо легкий runtime без SDK — він менший і безпечніший
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

# Копіюємо зібраний проєкт зі стадії 1
COPY --from=build /app/publish .

# Копіюємо ONNX модель окремо — вона не входить в publish автоматично
COPY XRayFractureDetection.WebAPI/Infrastructure/AI/Models/ Infrastructure/AI/Models/

# ASP.NET Core всередині контейнера слухає на порту 8080
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "XRayFractureDetection.WebAPI.dll"]
