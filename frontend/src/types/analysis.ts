export interface DetectionResult {
    isFracture: boolean;
    confidence: number;
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface AnalysisResponse {
    requestId: string;
    status: number;
    createdAt: string;
    detections: DetectionResult[];
}