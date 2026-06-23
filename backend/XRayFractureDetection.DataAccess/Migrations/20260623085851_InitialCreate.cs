using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace XRayFractureDetection.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AnalysisRequests",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ImageHash = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    ImageFileName = table.Column<string>(type: "character varying(260)", maxLength: 260, nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamptz", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnalysisRequests", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DetectionResults",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AnalysisRequestId = table.Column<Guid>(type: "uuid", nullable: false),
                    Confidence = table.Column<float>(type: "real", nullable: false),
                    BoundingBoxX = table.Column<float>(type: "real", nullable: false),
                    BoundingBoxY = table.Column<float>(type: "real", nullable: false),
                    BoundingBoxWidth = table.Column<float>(type: "real", nullable: false),
                    BoundingBoxHeight = table.Column<float>(type: "real", nullable: false),
                    IsFracture = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DetectionResults", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DetectionResults_AnalysisRequests_AnalysisRequestId",
                        column: x => x.AnalysisRequestId,
                        principalTable: "AnalysisRequests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AnalysisRequests_ImageHash",
                table: "AnalysisRequests",
                column: "ImageHash");

            migrationBuilder.CreateIndex(
                name: "IX_DetectionResults_AnalysisRequestId",
                table: "DetectionResults",
                column: "AnalysisRequestId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DetectionResults");

            migrationBuilder.DropTable(
                name: "AnalysisRequests");
        }
    }
}
