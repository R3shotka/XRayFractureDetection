import React, { useState } from 'react';
import { AnalysisResponse } from '../types/analysis';
import ResultCanvas from '../components/ResultCanvas';

interface AnalysisPageProps {
  selectedFile: File | null;
  result: AnalysisResponse | null;
  isLoading: boolean;
  error: string | null;
  onNewScan: () => void;
  onGoHome: () => void;
}

/* ─── Sparkline ─────────────────────────────────────────────── */
function Sparkline({ points }: { points: string }) {
  return (
    <svg viewBox="0 0 120 30" style={{ width: '100%', height: 26 }}>
      <polyline points={points} fill="none" stroke="#3b82f6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── RiskBadge ─────────────────────────────────────────────── */
function RiskBadge({ level }: { level: string }) {
  const map: Record<string, React.CSSProperties> = {
    'High Risk':   { background: '#fdeaea', color: '#e5484d' },
    'Medium Risk': { background: '#fff4e3', color: '#e8920f' },
    'Low Risk':    { background: '#eaf0fc', color: '#1d5fd6' },
  };
  const s = map[level] || map['Low Risk'];
  return (
    <span style={{ ...s, fontSize: 11.5, fontWeight: 700, padding: '5px 11px', borderRadius: 999, whiteSpace: 'nowrap' }}>
      {level}
    </span>
  );
}

/* ─── FindingRow ─────────────────────────────────────────────── */
function FindingRow({ dotColor, title, conf, risk, last }: {
  dotColor: string; title: string; conf: string; risk: string; last: boolean;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      paddingTop: 14, paddingBottom: last ? 0 : 14,
      borderBottom: last ? 'none' : '1px solid #eef1f6',
    }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: dotColor + '22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: dotColor }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>{title}</div>
        <div style={{ fontSize: 12, color: '#8a97ad' }}>Confidence: {conf}</div>
      </div>
      <RiskBadge level={risk} />
    </div>
  );
}

/* ─── Helpers ────────────────────────────────────────────────── */
function getRiskLabel(conf: number) {
  return conf >= 0.7 ? 'High Risk' : conf >= 0.45 ? 'Medium Risk' : 'Low Risk';
}
function getDotColor(conf: number) {
  return conf >= 0.7 ? '#ef4444' : conf >= 0.45 ? '#f59e0b' : '#3b82f6';
}
function getSeverityScore(maxConf: number) {
  return (maxConf * 10).toFixed(1);
}
function getConfidenceInfo(conf: number): { label: string; color: string } {
  if (conf >= 0.75) return { label: 'High Confidence',   color: '#1ea672' };
  if (conf >= 0.5)  return { label: 'Medium Confidence', color: '#e8920f' };
  return               { label: 'Low Confidence',    color: '#e5484d' };
}

/* ─── Main ───────────────────────────────────────────────────── */
export default function AnalysisPage({ selectedFile, result, isLoading, error, onNewScan, onGoHome }: AnalysisPageProps) {
  const [showBoxes, setShowBoxes] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);

  const maxConfidence = result?.detections.length
    ? Math.max(...result.detections.map(d => d.confidence))
    : 0;

  const confidenceInfo = getConfidenceInfo(maxConfidence);

  const overlayMetrics = result ? [
    { value: String(result.detections.length), label: 'Findings',   bg: 'rgba(255,255,255,.1)',  border: 'rgba(255,255,255,.15)', valueColor: '#fff',    labelColor: 'rgba(255,255,255,.5)' },
    { value: `${(maxConfidence * 100).toFixed(0)}%`, label: 'Confidence', bg: 'rgba(59,130,246,.2)', border: 'rgba(59,130,246,.4)',   valueColor: '#93c5fd', labelColor: 'rgba(147,197,253,.6)' },
    { value: getSeverityScore(maxConfidence),  label: 'Severity',   bg: 'rgba(245,158,11,.15)', border: 'rgba(245,158,11,.35)', valueColor: '#fcd34d', labelColor: 'rgba(252,211,77,.55)' },
  ] : [];

  return (
    <div style={{ minHeight: '100vh', background: '#eaeef4', fontFamily: "'Manrope', sans-serif", color: '#16233d', padding: '22px 30px 36px' }}>
      <div style={{ width: '100%', maxWidth: 1420, margin: '0 auto' }}>

        {/* ── HEADER ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, flexWrap: 'wrap', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
            <span onClick={onGoHome} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13.5, fontWeight: 600, color: '#5b6b85', cursor: 'pointer' }}>
              ← Back to Home
            </span>
            <div style={{ width: 1, height: 22, background: '#d5dde8' }} />
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-.02em', margin: 0 }}>Analysis Report</h1>
            {selectedFile && (
              <div style={{ background: '#eef2f8', color: '#5b6b85', fontSize: 13, fontWeight: 700, padding: '7px 14px', borderRadius: 8 }}>
                {selectedFile.name}
              </div>
            )}
          </div>
          <button onClick={onNewScan} style={{ fontFamily: "'Manrope',sans-serif", display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(145deg,#3b82f6,#1d5fd6)', color: '#fff', fontWeight: 700, fontSize: 14, padding: '11px 22px', borderRadius: 11, border: 'none', cursor: 'pointer', boxShadow: '0 8px 18px rgba(45,107,240,.28)' }}>
            + New Scan
          </button>
        </div>

        {/* ── MAIN GRID ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 370px', gap: 20 }}>

          {/* X-ray viewer */}
          <div style={{ background: '#111827', borderRadius: 22, overflow: 'hidden', position: 'relative', minHeight: 'calc(100vh - 160px)', boxShadow: '0 10px 36px rgba(10,20,50,.22)' }}>

            {/* Контролі — верхній правий кут */}
            {result && !isLoading && (
              <div style={{ position: 'absolute', top: 14, right: 14, zIndex: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                {/* Full size кнопка */}
                <button
                  onClick={() => setFullscreen(true)}
                  title="Full size"
                  style={{ fontFamily: "'Manrope',sans-serif", display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 999, padding: '7px 14px', color: 'rgba(255,255,255,.7)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                  </svg>
                  Full Size
                </button>
                {/* Bounding boxes toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'rgba(255,255,255,.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 999, padding: '7px 14px' }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.55)' }}>Bounding Boxes</span>
                  <div
                    onClick={() => setShowBoxes(v => !v)}
                    style={{ width: 40, height: 22, borderRadius: 999, background: showBoxes ? '#3b82f6' : 'rgba(255,255,255,.18)', position: 'relative', transition: 'background .2s', cursor: 'pointer', flexShrink: 0 }}
                  >
                    <div style={{ position: 'absolute', top: 3, left: showBoxes ? 21 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left .2s', boxShadow: '0 1px 4px rgba(0,0,0,.3)' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Canvas / loader / error */}
            <div style={{ position: 'absolute', inset: '0 0 90px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {isLoading ? (
                <div style={{ minHeight: 480, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                  <div style={{ width: 52, height: 52, border: '4px solid rgba(59,130,246,.2)', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
                  <span style={{ color: 'rgba(255,255,255,.4)', fontWeight: 600, fontSize: 15 }}>Analyzing image...</span>
                </div>
              ) : error ? (
                <div style={{ minHeight: 480, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 40 }}>
                  <span style={{ fontSize: 36 }}>⚠️</span>
                  <span style={{ color: '#e5484d', fontWeight: 600, fontSize: 15 }}>{error}</span>
                  <button onClick={onNewScan} style={{ fontFamily: "'Manrope',sans-serif", marginTop: 8, background: '#1d3557', color: '#fff', fontWeight: 700, fontSize: 14, padding: '10px 20px', borderRadius: 11, border: 'none', cursor: 'pointer' }}>Try Again</button>
                </div>
              ) : selectedFile && result ? (
                <ResultCanvas imageFile={selectedFile} detections={result.detections} showBoxes={showBoxes} />
              ) : null}
            </div>

            {/* Gradient overlay з метриками — тільки після аналізу */}
            {result && !isLoading && (
              <>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 220, background: 'linear-gradient(to top, rgba(8,14,26,.95) 0%, transparent 100%)', pointerEvents: 'none' }} />

                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 28px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20 }}>

                  {/* Ліворуч — тип знімку + кількість знахідок */}
                  <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(59,130,246,.18)', backdropFilter: 'blur(8px)', border: '1px solid rgba(59,130,246,.35)', color: '#93c5fd', fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 999, marginBottom: 10, letterSpacing: '.04em' }}>
                      X-RAY · AI ANALYSIS
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-.02em', lineHeight: 1.1, marginBottom: 4 }}>
                      {result.detections.length === 0 ? 'No fractures found' : `${result.detections.length} fracture${result.detections.length > 1 ? 's' : ''} detected`}
                    </div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', fontWeight: 500 }}>
                      {selectedFile?.name}
                    </div>
                  </div>

                  {/* По центру — метрик-пілюлі */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {overlayMetrics.map((m) => (
                      <div key={m.label} style={{ background: m.bg, backdropFilter: 'blur(10px)', border: `1px solid ${m.border}`, borderRadius: 14, padding: '12px 18px', textAlign: 'center', minWidth: 86 }}>
                        <div style={{ fontSize: 22, fontWeight: 800, color: m.valueColor, letterSpacing: '-.02em' }}>{m.value}</div>
                        <div style={{ fontSize: 11, color: m.labelColor, fontWeight: 600, marginTop: 2 }}>{m.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Праворуч — статус */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(30,166,114,.18)', backdropFilter: 'blur(8px)', border: '1px solid rgba(30,166,114,.35)', borderRadius: 12, padding: '10px 16px' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#1ea672', boxShadow: '0 0 0 3px rgba(30,166,114,.3)' }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#6ee7b7' }}>Analysis complete</span>
                  </div>

                </div>
              </>
            )}
          </div>

          {/* Права панель */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* AI Analysis */}
            <div style={{ background: '#fff', borderRadius: 20, padding: 22, boxShadow: '0 6px 24px rgba(30,50,90,.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontWeight: 800, fontSize: 17 }}>AI Analysis</span>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#e2ecfd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#1d5fd6' }}>AI</div>
              </div>
              <div style={{ fontSize: 13, color: '#8a97ad', fontWeight: 600, marginBottom: 4 }}>Overall Confidence</div>
              <div style={{ fontSize: 42, fontWeight: 800, letterSpacing: '-.03em', marginBottom: 2 }}>
                {isLoading ? '—' : result ? `${(maxConfidence * 100).toFixed(0)}%` : '—'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: isLoading ? '#8a97ad' : confidenceInfo.color }}>
                  {isLoading ? 'Processing...' : confidenceInfo.label}
                </span>
                <Sparkline points="0,20 12,16 24,22 36,10 48,16 60,8 72,13 90,8" />
              </div>
            </div>

            {/* Detected Findings */}
            <div style={{ background: '#fff', borderRadius: 20, padding: 22, boxShadow: '0 6px 24px rgba(30,50,90,.06)', flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 4 }}>Detected Findings</div>

              {isLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{ height: 52, borderRadius: 10, background: '#f0f4fb', animation: 'pulse 1.2s ease infinite' }} />
                  ))}
                </div>
              ) : result && result.detections.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '28px 0', color: '#1ea672', fontWeight: 700, fontSize: 14 }}>
                  <span style={{ fontSize: 32 }}>✅</span>
                  No fractures detected
                </div>
              ) : result ? (
                <>
                  {result.detections.map((d, i) => (
                    <FindingRow
                      key={i}
                      dotColor={getDotColor(d.confidence)}
                      title={`Fracture #${i + 1}`}
                      conf={`${(d.confidence * 100).toFixed(1)}%`}
                      risk={getRiskLabel(d.confidence)}
                      last={i === result.detections.length - 1}
                    />
                  ))}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, marginTop: 4, borderTop: '1px solid #eef1f6' }}>
                    <span style={{ color: '#2f6bf0', fontWeight: 700, fontSize: 14 }}>
                      {result.detections.length} finding{result.detections.length !== 1 ? 's' : ''} total
                    </span>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#f0f4fb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2f6bf0', fontSize: 15 }}>→</div>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen modal */}
      {fullscreen && selectedFile && result && (
        <div
          onClick={() => setFullscreen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#080e1a', display: 'flex', flexDirection: 'column' }}
        >
          {/* Топбар */}
          <div
            onClick={e => e.stopPropagation()}
            style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,.08)' }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,.4)' }}>
              {selectedFile.name}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Bounding boxes toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 999, padding: '7px 14px' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.5)' }}>Bounding Boxes</span>
                <div
                  onClick={() => setShowBoxes(v => !v)}
                  style={{ width: 40, height: 22, borderRadius: 999, background: showBoxes ? '#3b82f6' : 'rgba(255,255,255,.18)', position: 'relative', transition: 'background .2s', cursor: 'pointer', flexShrink: 0 }}
                >
                  <div style={{ position: 'absolute', top: 3, left: showBoxes ? 21 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left .2s', boxShadow: '0 1px 4px rgba(0,0,0,.3)' }} />
                </div>
              </div>

              {/* Закрити */}
              <button
                onClick={() => setFullscreen(false)}
                style={{ fontFamily: "'Manrope',sans-serif", width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', color: 'rgba(255,255,255,.7)', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Canvas на весь залишок екрану */}
          <div
            onClick={e => e.stopPropagation()}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: 16 }}
          >
            <ResultCanvas imageFile={selectedFile} detections={result.detections} showBoxes={showBoxes} fillContainer />
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.4; } }
      `}</style>
    </div>
  );
}
