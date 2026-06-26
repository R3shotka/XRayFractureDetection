import React, { useEffect, useRef } from 'react';
import { DetectionResult } from '../types/analysis';

interface Props {
    imageFile: File;
    detections: DetectionResult[];
    showBoxes?: boolean;
    fillContainer?: boolean;
}

function ResultCanvas({ imageFile, detections, showBoxes = true, fillContainer = false }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const imageUrl = URL.createObjectURL(imageFile);
        const img = new Image();
        img.src = imageUrl;

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);

            if (showBoxes) {
                detections.forEach(d => {
                    const x = d.x * img.width;
                    const y = d.y * img.height;
                    const w = d.width * img.width;
                    const h = d.height * img.height;

                    ctx.strokeStyle = '#ff0000';
                    ctx.lineWidth = 3;
                    ctx.strokeRect(x, y, w, h);

                    const label = `${(d.confidence * 100).toFixed(0)}%`;
                    ctx.font = 'bold 16px Arial';
                    const textWidth = ctx.measureText(label).width;

                    ctx.fillStyle = '#ff0000';
                    ctx.fillRect(x, y - 22, textWidth + 8, 22);

                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(label, x + 4, y - 6);
                });
            }

            // Stretch="Uniform": вписати пропорційно в контейнер
            if (fillContainer && containerRef.current) {
                const cw = containerRef.current.clientWidth;
                const ch = containerRef.current.clientHeight;
                const aspect = img.width / img.height;

                if (cw / ch > aspect) {
                    canvas.style.height = ch + 'px';
                    canvas.style.width = (ch * aspect) + 'px';
                } else {
                    canvas.style.width = cw + 'px';
                    canvas.style.height = (cw / aspect) + 'px';
                }
            }

            URL.revokeObjectURL(imageUrl);
        };

    }, [imageFile, detections, showBoxes, fillContainer]);

    return (
        <div
            ref={containerRef}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}
        >
            <canvas
                ref={canvasRef}
                style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', display: 'block' }}
            />
        </div>
    );
}

export default ResultCanvas;
