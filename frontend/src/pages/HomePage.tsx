import React, { useState } from 'react';

/* ─── Допоміжні компоненти ────────────────────────────────── */

// Слот для статичної картинки.
// Щоб додати зображення — передай src="/images/назва-файлу.jpg"
// Поклади файл у папку frontend/public/images/
function ImgSlot({
  src,
  alt,
  style,
  radius = 12,
  objectFit = 'cover',
  objectPosition = 'center',
}: {
  src?: string;   // ← СЮДИ вставляєш шлях до картинки
  alt: string;
  style?: React.CSSProperties;
  radius?: number | string;
  objectFit?: 'cover' | 'contain';
  objectPosition?: string;
}) {
  const borderRadius = typeof radius === 'number' ? `${radius}px` : radius;

  return (
    <div style={{ borderRadius, overflow: 'hidden', background: '#e4ecf6', flexShrink: 0, ...style }}>
      {src ? (
        <img
          src={src}
          alt={alt}
          style={{ width: '100%', height: '100%', objectFit, objectPosition, display: 'block' }}
        />
      ) : (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 8 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a0b4cc" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
          </svg>
          <span style={{ fontSize: 11, color: '#a0b4cc', fontWeight: 500, textAlign: 'center' }}>{alt}</span>
        </div>
      )}
    </div>
  );
}

function Sparkline({ points, color = '#2f6bf0' }: { points: string; color?: string }) {
  return (
    <svg viewBox="0 0 150 34" style={{ width: '100%', height: 30 }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Badge({ level }: { level: 'high' | 'medium' | 'low' }) {
  const map = {
    high: { bg: '#fdeaea', color: '#e5484d', label: 'High Risk' },
    medium: { bg: '#fff4e3', color: '#e8920f', label: 'Medium Risk' },
    low: { bg: '#eaf0fc', color: '#2f6bf0', label: 'Low Risk' },
  };
  const s = map[level];
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 700, padding: '5px 11px', borderRadius: 999 }}>
      {s.label}
    </span>
  );
}

function MetricCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', borderRadius: 18, padding: 20, boxShadow: '0 6px 24px rgba(30,50,90,.06)' }}>
      <div style={{ fontSize: 13.5, color: '#5b6b85', fontWeight: 600, marginBottom: 14 }}>{title}</div>
      {children}
    </div>
  );
}

function ArrowBtn({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#f0f4fb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5b6b85', flexShrink: 0, cursor: 'pointer', fontSize: 18, userSelect: 'none' }}>
      {children}
    </div>
  );
}

/* ─── Головна сторінка ────────────────────────────────────── */

interface HomePageProps {
  onStartScan: () => void;
  onFileDrop?: (file: File) => void;
}

export default function HomePage({ onStartScan, onFileDrop }: HomePageProps) {
  const [galleryPage, setGalleryPage] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  const allSamples = [
    { src: '/images/sample1.jpg', alt: 'X-ray sample 1' },
    { src: '/images/sample2.jpg', alt: 'X-ray sample 2' },
    { src: '/images/sapmle3.jpg', alt: 'X-ray sample 3' },
    { src: '/images/sample4.jpg', alt: 'X-ray sample 4' },
    { src: '/images/sample5.jpg', alt: 'X-ray sample 5' },
    { src: '/images/sample6.jpg', alt: 'X-ray sample 6' },
    { src: '/images/sample7.jpg', alt: 'X-ray sample 7' },
    { src: '/images/sample8.jpg', alt: 'X-ray sample 8' },
  ];
  const perPage = 4;
  const totalPages = Math.ceil(allSamples.length / perPage);
  const visibleSamples = allSamples.slice(galleryPage * perPage, galleryPage * perPage + perPage);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && onFileDrop) onFileDrop(file);
  };

  const card: React.CSSProperties = {
    background: '#fff',
    borderRadius: 22,
    boxShadow: '0 6px 24px rgba(30,50,90,.06)',
    padding: 22,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#eaeef4', fontFamily: "'Manrope', sans-serif", color: '#16233d', padding: '22px 30px 26px' }}>
      <div style={{ maxWidth: 1420, margin: '0 auto' }}>

        {/* ── HERO ROW ─────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '330px 1.12fr 1fr 290px', gap: 18, alignItems: 'stretch', marginBottom: 18 }}>

          {/* Заголовок і кнопка */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '6px 4px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, marginBottom: 26 }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#2f6bf0' }} />
              Musculoskeletal System
            </div>
            <h1 style={{ fontSize: 62, lineHeight: .96, letterSpacing: '-.035em', fontWeight: 800, marginBottom: 22 }}>
              BONE<br />HEALTH
            </h1>
            <p style={{ fontSize: 15.5, lineHeight: 1.6, color: '#5b6b85', marginBottom: 30, maxWidth: 280 }}>
              AI-powered fracture detection and severity assessment for faster, more accurate diagnosis
            </p>
            <div
              onClick={onStartScan}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              style={{ width: 230, borderRadius: 18, border: `2px dashed ${dragOver ? '#3b82f6' : '#b8c8e0'}`, background: dragOver ? 'rgba(59,130,246,.07)' : '#f4f7fc', padding: '18px 14px', cursor: 'pointer', textAlign: 'center', transition: 'all .18s' }}
            >
              <div style={{ width: 38, height: 38, borderRadius: 11, background: dragOver ? '#dbeafe' : '#e8eef8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', transition: 'background .18s' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={dragOver ? '#3b82f6' : '#7a90b0'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: dragOver ? '#2563eb' : '#3b5278', marginBottom: 4 }}>Drop X-Ray here</div>
              <div style={{ fontSize: 12, color: '#8a97ad' }}>or <span style={{ color: '#3b82f6', fontWeight: 600 }}>click to browse</span></div>
              <div style={{ fontSize: 11, color: '#b0bcc8', marginTop: 6 }}>JPEG · PNG · BMP</div>
            </div>
          </div>

          {/* Головне зображення рентгену ─────────────────────
              Сюди треба: 3D рентген руки (наприклад hand-xray-3d.jpg)
              Крок 1: поклади файл у frontend/public/images/
              Крок 2: передай src="/images/hand-xray-3d.jpg" в ImgSlot нижче
          ─────────────────────────────────────────────────── */}
          <div style={{ position: 'relative', background: 'linear-gradient(160deg,#eaf1fb,#dfeaf8)', borderRadius: 24, overflow: 'hidden', minHeight: 540, boxShadow: '0 6px 24px rgba(30,50,90,.06)' }}>
            <ImgSlot
              src="/images/firstWrist.png"
              alt="Hand X-ray"
              objectFit="cover"
              objectPosition="20% center"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', borderRadius: 0, background: 'transparent' }}
              radius={0}
            />

            {/* Чіп точності моделі — лівий нижній кут */}
            <div style={{ position: 'absolute', left: 10, bottom: 10, background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(8px)', borderRadius: 12, padding: '8px 11px', width: 116, boxShadow: '0 4px 14px rgba(30,50,90,.12)' }}>
              <div style={{ fontSize: 10, color: '#8a97ad', fontWeight: 600, marginBottom: 2 }}>Model Accuracy</div>
              <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-.02em', marginBottom: 3 }}>94%</div>
              <Sparkline points="0,26 18,22 36,25 54,16 72,19 90,10 108,14 126,6 140,9" />
              <div style={{ fontSize: 10, color: '#1ea672', fontWeight: 700, marginTop: 3 }}>Validated on 10k+ scans</div>
            </div>
          </div>

          {/* 3D модель кістки ────────────────────────────────
              Сюди треба: 3D зображення кісток руки/скелет
              Крок 1: поклади файл у frontend/public/images/
              Крок 2: передай src="/images/bone-3d.jpg" в ImgSlot нижче
          ─────────────────────────────────────────────────── */}
          <div style={{ ...card, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontWeight: 800, fontSize: 16 }}>3D Bone Model</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#e7f7ee', color: '#1ea672', fontSize: 12, fontWeight: 700, padding: '5px 11px', borderRadius: 999 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#1ea672' }} />Interactive
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff4e3', color: '#c2600a', fontSize: 12, fontWeight: 700, padding: '5px 11px', borderRadius: 999 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f97316' }} />Soon
                </span>
              </div>
            </div>
            <p style={{ fontSize: 13, color: '#8a97ad', marginBottom: 12 }}>
              Visualize bone structure and pinpoint fracture locations with precision
            </p>
            <div style={{ position: 'relative', flex: 1, borderRadius: 16, overflow: 'hidden', minHeight: 380 }}>
              <ImgSlot
                src="/images/bone3D.png"
                alt="3D Bone Model"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', borderRadius: 0 }}
                radius={0}
              />
              <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['⟳', '◫', '▤', '⤢'].map((ic, i) => (
                  <div key={i} style={{ width: 38, height: 38, borderRadius: 11, background: '#fff', boxShadow: '0 3px 10px rgba(30,50,90,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5b6b85', fontSize: 15, cursor: 'pointer' }}>{ic}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Типові знахідки — демо-приклад */}
          <div style={{ ...card, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontWeight: 800, fontSize: 16 }}>Example Findings</span>
              <span style={{ fontSize: 12, color: '#8a97ad', fontWeight: 600, background: '#f0f4fb', padding: '4px 10px', borderRadius: 999 }}>Demo</span>
            </div>
            <p style={{ fontSize: 13, color: '#8a97ad', marginBottom: 18, lineHeight: 1.5 }}>
              The AI detects fractures instantly, providing bounding boxes, confidence scores and risk level
            </p>
            {[
              { dotColor: '#ef4444', title: 'Fracture #1', conf: '86.2%', risk: 'high' as const },
              { dotColor: '#f59e0b', title: 'Fracture #2', conf: '73.1%', risk: 'medium' as const },
            ].map((f, i, arr) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: i === 0 ? 0 : 14, paddingBottom: i < arr.length - 1 ? 14 : 0, borderBottom: i < arr.length - 1 ? '1px solid #eef1f6' : 'none' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: f.dotColor + '22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: f.dotColor }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{f.title}</div>
                  <div style={{ fontSize: 12, color: '#8a97ad' }}>Confidence: {f.conf}</div>
                </div>
                <Badge level={f.risk} />
              </div>
            ))}
            <div style={{ flex: 1 }} />
            <button
              onClick={onStartScan}
              style={{ fontFamily: "'Manrope',sans-serif", marginTop: 20, width: '100%', background: 'linear-gradient(145deg,#3b82f6,#1d5fd6)', color: '#fff', fontWeight: 700, fontSize: 14, padding: '12px', borderRadius: 12, border: 'none', cursor: 'pointer' }}
            >
              Analyze Your Scan →
            </button>
          </div>
        </div>

        {/* ── MAIN GRID ────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 290px', gap: 18 }}>

          {/* Ліва частина */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Метрики системи */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14 }}>
              <MetricCard title="Detection Accuracy">
                <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-.02em', marginBottom: 14 }}>94%</div>
                <div style={{ height: 7, background: '#eef1f6', borderRadius: 999, overflow: 'hidden', marginBottom: 12 }}>
                  <div style={{ height: '100%', width: '94%', background: 'linear-gradient(90deg,#3b82f6,#1d5fd6)', borderRadius: 999 }} />
                </div>
                <div style={{ fontSize: 12, color: '#8a97ad' }}><span style={{ color: '#1ea672', fontWeight: 700 }}>↑ 3%</span> vs previous model</div>
              </MetricCard>
              <MetricCard title="Avg. Analysis Time">
                <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-.02em', marginBottom: 8 }}>1.2s</div>
                <Sparkline points="0,24 16,20 32,26 48,14 64,22 80,12 96,18 112,10 130,20 150,15" />
                <div style={{ fontSize: 12.5, color: '#1ea672', fontWeight: 700, marginTop: 6 }}>Real-time</div>
              </MetricCard>
              <MetricCard title="Fracture Types">
                <div style={{ fontSize: 26, fontWeight: 800, color: '#2f6bf0', marginBottom: 16 }}>12 types</div>
                <div style={{ height: 7, background: '#eef1f6', borderRadius: 999, overflow: 'hidden', marginBottom: 12 }}>
                  <div style={{ height: '100%', width: '80%', background: 'linear-gradient(90deg,#3b82f6,#8b5cf6)', borderRadius: 999 }} />
                </div>
                <div style={{ fontSize: 12, color: '#8a97ad' }}>Covered bone regions</div>
              </MetricCard>
              <MetricCard title="Scans Processed">
                <div style={{ fontSize: 26, fontWeight: 800, color: '#1ea672', marginBottom: 8 }}>10k+</div>
                <Sparkline points="0,20 16,24 32,16 48,22 64,12 80,20 96,14 112,22 130,12 150,18" />
                <div style={{ fontSize: 12, color: '#8a97ad', marginTop: 6 }}><span style={{ color: '#1ea672', fontWeight: 700 }}>↑ 18%</span> this month</div>
              </MetricCard>
              <MetricCard title="Model Version">
                <div style={{ fontSize: 26, fontWeight: 800, color: '#1ea672', marginBottom: 42 }}>YOLOv8</div>
                <div style={{ fontSize: 12, color: '#8a97ad' }}>Updated: 2025</div>
              </MetricCard>
            </div>

            {/* Нижній ряд */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>

              {/* Приклади рентгенів ──────────────────────────
                  Сюди треба: 4 приклади рентген-знімків
                  Крок 1: поклади файли у frontend/public/images/
                  Крок 2: передай src у кожен ImgSlot нижче
              ─────────────────────────────────────────────── */}
              <div style={{ ...card }}>
                <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 6 }}>X-Ray Sample Gallery</div>
                <p style={{ fontSize: 13, color: '#8a97ad', marginBottom: 18 }}>
                  Examples of fracture patterns detected by our AI across different bone types and injury severities
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    onClick={() => setGalleryPage(p => Math.max(0, p - 1))}
                    style={{ width: 34, height: 34, borderRadius: '50%', background: galleryPage === 0 ? '#f0f4fb' : '#e2ecfd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: galleryPage === 0 ? '#c0ccd8' : '#2f6bf0', flexShrink: 0, cursor: galleryPage === 0 ? 'default' : 'pointer', fontSize: 18, userSelect: 'none' }}
                  >‹</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, flex: 1 }}>
                    {visibleSamples.map((s, i) => (
                      <ImgSlot key={i} src={s.src} alt={s.alt} style={{ width: '100%', height: 118 }} />
                    ))}
                  </div>
                  <div
                    onClick={() => setGalleryPage(p => Math.min(totalPages - 1, p + 1))}
                    style={{ width: 34, height: 34, borderRadius: '50%', background: galleryPage >= totalPages - 1 ? '#f0f4fb' : '#e2ecfd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: galleryPage >= totalPages - 1 ? '#c0ccd8' : '#2f6bf0', flexShrink: 0, cursor: galleryPage >= totalPages - 1 ? 'default' : 'pointer', fontSize: 18, userSelect: 'none' }}
                  >›</div>
                </div>
                <div style={{ marginTop: 22 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: '#5b6b85' }}>
                    <span style={{ width: 19, height: 19, borderRadius: 6, background: '#2f6bf0', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }}>✓</span>
                    All samples validated by certified radiologists
                  </label>
                </div>
              </div>

              {/* Карта кісток ────────────────────────────────
                  Сюди треба: анатомічна схема руки (bones labeled)
                  Крок 1: поклади файл у frontend/public/images/
                  Крок 2: передай src="/images/hand-anatomy.jpg" в ImgSlot нижче
              ─────────────────────────────────────────────── */}
              <div style={{ ...card }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 17 }}>Fracture Location Map</div>
                    <p style={{ fontSize: 13, color: '#8a97ad', marginTop: 4 }}>
                      AI identifies the exact bone and region affected
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {[
                      ['#e5484d', 'High Risk of Fracture'],
                      ['#e8920f', 'Medium Risk of Fracture'],
                      ['#2f6bf0', 'Low Risk of Fracture'],
                    ].map(([c, l]) => (
                      <span key={l} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#5b6b85' }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, flexShrink: 0 }} />{l}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 10, alignItems: 'center' }}>
                  <ImgSlot
                    src="/images/2dModel.png"
                    alt="Hand anatomy"
                    style={{ width: 140, height: 260 }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {([
                      ['Phalanges',            'low'],
                      ['Metacarpal (5th)',      'medium'],
                      ['Ulna (Styloid)',        'low'],
                      ['Radius (Distal End)',   'high'],
                    ] as [string, 'high' | 'medium' | 'low'][]).map(([name, risk]) => (
                      <div key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{name}</span>
                        <Badge level={risk} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Права колонка */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Як це працює */}
            <div style={{ ...card }}>
              <div style={{ fontWeight: 800, fontSize: 16, lineHeight: 1.3, marginBottom: 18 }}>How It Works</div>
              {[
                { icon: '📤', title: 'Upload X-Ray', sub: 'Drag & drop or select JPEG / PNG / BMP up to 20 MB' },
                { icon: '🤖', title: 'AI Analysis', sub: 'YOLOv8 model scans the image in under 2 seconds' },
                { icon: '📋', title: 'View Results', sub: 'Get bounding boxes, confidence scores, and risk level' },
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: i < 2 ? 16 : 0, paddingBottom: i < 2 ? 16 : 0, borderBottom: i < 2 ? '1px solid #eef1f6' : 'none' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: '#eaf0fc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{step.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{step.title}</div>
                    <div style={{ fontSize: 12.5, color: '#8a97ad', marginTop: 3, lineHeight: 1.4 }}>{step.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Підтримувані типи знімків ───────────────────────
                Сюди треба: 3 приклади рентгенів (мініатюри)
                Крок 1: поклади файли у frontend/public/images/
                Крок 2: передай src у кожен ImgSlot нижче
            ─────────────────────────────────────────────────── */}
            <div style={{ ...card, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <span style={{ fontWeight: 800, fontSize: 16 }}>Supported Scan Types</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { src: '/images/wrist.jpg',   alt: 'Wrist X-Ray',   label: 'Wrist / Forearm', sub: 'Radius, Ulna fractures' },
                  { src: '/images/hand.jpg',    alt: 'Hand X-Ray',    label: 'Hand / Fingers',  sub: 'Metacarpal, Phalanges' },
                  { src: '/images/humerus.jpg', alt: 'Forearm X-Ray', label: 'Elbow / Humerus', sub: 'Complex joint fractures' },
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <ImgSlot
                      src={s.src}
                      alt={s.alt}
                      style={{ width: 46, height: 46, flexShrink: 0 }}
                      radius={10}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 13.5 }}>{s.label}</div>
                      <div style={{ fontSize: 12, color: '#8a97ad' }}>{s.sub}</div>
                    </div>
                    <span style={{ background: '#e7f7ee', color: '#1ea672', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999 }}>✓</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── FOOTER ───────────────────────────────────────── */}
        <div style={{ background: '#fff', borderRadius: 18, padding: '22px 30px', marginTop: 18, display: 'flex', alignItems: 'center', gap: 60, boxShadow: '0 6px 24px rgba(30,50,90,.06)' }}>
          {[
            { ic: '✓', bg: '#e7f7ee', color: '#1ea672', title: 'Radiologist Approved', sub: 'Clinically validated AI models' },
            { ic: '🔒', bg: '#eaf0fc', color: '#2f6bf0', title: 'HIPAA Compliant', sub: 'Secure & encrypted data' },
            { ic: '⇄', bg: '#f3edfd', color: '#8b5cf6', title: 'Integrated Workflow', sub: 'Seamless EHR integration' },
          ].map((f) => (
            <div key={f.title} style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
              <div style={{ width: 42, height: 42, borderRadius: 11, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color, fontSize: 18 }}>{f.ic}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{f.title}</div>
                <div style={{ fontSize: 12.5, color: '#8a97ad' }}>{f.sub}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
