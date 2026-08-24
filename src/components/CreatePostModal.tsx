import React, { useState, useRef } from 'react';
import { Sparkles, Image, Video, Upload, Tag, AlertTriangle, Play, Pause, CheckCircle2, Film, ShieldCheck, Camera, Flame } from 'lucide-react';
import { useAura } from '../context/AuraContext';
import { AnimeAuraCameraStudio } from './AnimeAuraCameraStudio';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_MEDIA = [
  {
    title: '8s Treino Hardcore 🔥',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    type: 'video' as const,
    duration: 8.0,
    tags: ['#GymSigma', '#Focus8s', '#PR', '#AuraGain']
  },
  {
    title: 'Foto: Deadlift 180kg 🏋️',
    url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    type: 'image' as const,
    tags: ['#GymSigma', '#PR', '#Focus', '#AuraGain']
  },
  {
    title: 'Foto: 5AM Deep Work 💻',
    url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80',
    type: 'image' as const,
    tags: ['#5AMClub', '#DeepWork', '#CosmicAura']
  },
  {
    title: 'Foto: Corrida Matinal 🏃',
    url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&auto=format&fit=crop&q=80',
    type: 'image' as const,
    tags: ['#Running', '#Disciplina', '#SigmaBlue']
  },
  {
    title: 'Foto: Aura Loss Meme 💀',
    url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
    type: 'image' as const,
    tags: ['#AuraLoss', '#GymFail', '#NPCMoment']
  }
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const { createPost, currentUser, setCurrentTab } = useAura();

  const [caption, setCaption] = useState('');
  const [mediaUrl, setMediaUrl] = useState(PRESET_MEDIA[0].url);
  const [mediaType, setMediaType] = useState<'image' | 'video'>(PRESET_MEDIA[0].type);
  const [videoDuration, setVideoDuration] = useState<number | undefined>(PRESET_MEDIA[0].duration);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isValidatingVideo, setIsValidatingVideo] = useState(false);
  const [tagInput, setTagInput] = useState('#AuraMax #Disciplina #W');
  const [isCameraStudioOpen, setIsCameraStudioOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleCaptureFromStudio = (blob: Blob, dataUrl: string, durationSeconds: number, filterUsed: string) => {
    setMediaUrl(dataUrl);
    setMediaType('video');
    setVideoDuration(durationSeconds);
    setVideoError(null);
    setIsCameraStudioOpen(false);

    // Auto append anime aura tags
    const filterTag = '#' + filterUsed.replace(/\s+/g, '');
    if (!tagInput.includes(filterTag)) {
      setTagInput(prev => `${prev} ${filterTag} #AnimeAura #8sClip`.trim());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim() || !mediaUrl.trim()) return;

    if (mediaType === 'video' && videoDuration && videoDuration > 8.5) {
      setVideoError('O vídeo excede o limite máximo permitido de 8.0 segundos.');
      return;
    }

    const parsedTags = tagInput
      .split(' ')
      .map(t => t.trim())
      .filter(t => t.startsWith('#') && t.length > 1);

    createPost({
      caption: caption.trim(),
      mediaUrl: mediaUrl.trim(),
      mediaType,
      videoDuration: mediaType === 'video' ? (videoDuration || 8.0) : undefined,
      tags: parsedTags.length > 0 ? parsedTags : ['#AuraCheck', '#FarmAura']
    });

    setCaption('');
    setVideoError(null);
    onClose();
    setCurrentTab('feed');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoError(null);
    const isVideo = file.type.startsWith('video/');

    if (isVideo) {
      setIsValidatingVideo(true);
      const tempUrl = URL.createObjectURL(file);
      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';
      videoElement.src = tempUrl;

      videoElement.onloadedmetadata = () => {
        const duration = videoElement.duration;
        window.URL.revokeObjectURL(tempUrl);
        setIsValidatingVideo(false);

        // Limit strictly to 8 seconds (+ 0.5s tolerance for encoder rounding)
        if (duration > 8.5) {
          setVideoError(`⚠️ O vídeo tem ${duration.toFixed(1)}s! O AuraMax limita os vídeos a 8.0 segundos no máximo para manter a agilidade e economizar largura de banda.`);
          setMediaUrl('');
          setVideoDuration(undefined);
          return;
        }

        setVideoDuration(duration);
        setMediaType('video');

        // Convert file to Data URL for client-side storage preview
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setMediaUrl(event.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      };

      videoElement.onerror = () => {
        setIsValidatingVideo(false);
        setVideoError('Não foi possível ler o arquivo de vídeo. Formatos recomendados: MP4, WebM.');
      };
    } else {
      // Photo / Image
      setMediaType('image');
      setVideoDuration(undefined);
      setVideoError(null);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setMediaUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-neutral-900 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black italic tracking-tight uppercase text-white">
                Novo Momento de Aura
              </h3>
              <p className="text-xs text-neutral-400">
                Fotos ou <span className="text-amber-400 font-bold">Vídeos de até 8s</span> para votação comunitária
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-300 p-2 text-base font-bold"
          >
            ✕
          </button>
        </div>

        {/* 8s Video Policy Alert Banner */}
        <div className="p-3 rounded-2xl bg-neutral-950 border border-amber-400/20 flex items-start gap-3">
          <Film className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-xs">
            <p className="font-bold text-amber-300">
              Regra de Vídeo: Máximo 8 Segundos
            </p>
            <p className="text-neutral-400 text-[11px] leading-tight">
              Garante carregamentos ultrarrápidos, mantém o ritmo do feed e otimiza a infraestrutura de Object Storage/CDN da base de dados.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Anime Aura Studio Camera Highlight Button */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-red-500/20 border border-amber-400/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-black flex items-center justify-center font-bold shadow-md shadow-amber-400/30 flex-shrink-0">
                <Flame className="w-6 h-6 animate-bounce" style={{ animationDuration: '2s' }} />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-white font-mono flex items-center gap-1.5">
                  <span>Aura Studio Camera (Filtros de Anime)</span>
                  <span className="px-1.5 py-0.2 rounded bg-amber-400 text-black text-[9px] font-extrabold">NOVO</span>
                </h4>
                <p className="text-[11px] text-neutral-300 leading-tight">
                  Grava 8s com <strong>Super Saiyan Ki (Dragon Ball)</strong> ou <strong>Getsuga Tenshō (Bleach)</strong> em tempo real!
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsCameraStudioOpen(true)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono font-extrabold text-xs transition-transform active:scale-95 shadow-md shadow-amber-400/30 flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <Camera className="w-4 h-4" />
              Abrir Câmara de Aura
            </button>
          </div>

          {/* Preset Visuals Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider font-mono flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Image className="w-3.5 h-3.5 text-amber-400" />
                1. Escolha um Template ou Carregue o seu Ficheiro
              </span>
              <span className="text-[10px] text-neutral-400">
                {mediaType === 'video' ? '📹 Vídeo (8s)' : '📷 Imagem'}
              </span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRESET_MEDIA.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setMediaUrl(preset.url);
                    setMediaType(preset.type);
                    setVideoDuration(preset.duration);
                    setVideoError(null);
                    setTagInput(preset.tags.join(' '));
                  }}
                  className={`p-2 rounded-xl text-left border transition-all flex flex-col gap-1.5 relative overflow-hidden ${
                    mediaUrl === preset.url
                      ? 'bg-amber-400/10 border-amber-400 ring-1 ring-amber-400/30 text-amber-300'
                      : 'bg-neutral-950 border-white/5 text-neutral-400 hover:border-white/20'
                  }`}
                >
                  {preset.type === 'video' ? (
                    <div className="relative w-full h-16 rounded-lg overflow-hidden bg-black flex items-center justify-center">
                      <video
                        src={preset.url}
                        muted
                        autoPlay
                        loop
                        playsInline
                        className="w-full h-full object-cover opacity-80"
                      />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-amber-400 font-mono text-[9px] font-bold border border-amber-400/30 flex items-center gap-0.5">
                        <Film className="w-2.5 h-2.5" /> 8s
                      </span>
                    </div>
                  ) : (
                    <img
                      src={preset.url}
                      alt={preset.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-16 object-cover rounded-lg"
                    />
                  )}
                  <span className="text-[11px] font-bold truncate">
                    {preset.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Upload or Custom URL */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <input
                  type="url"
                  placeholder="Cole o link direto da imagem ou vídeo MP4..."
                  value={mediaUrl}
                  onChange={(e) => {
                    setMediaUrl(e.target.value);
                    setVideoError(null);
                    if (e.target.value.endsWith('.mp4') || e.target.value.endsWith('.webm')) {
                      setMediaType('video');
                      setVideoDuration(8.0);
                    }
                  }}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-white/10"
              >
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                Upload (Foto/Vídeo)
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {isValidatingVideo && (
              <p className="text-xs text-amber-400 font-mono animate-pulse flex items-center gap-1">
                <Film className="w-3 h-3" /> A validar duração do vídeo (limite 8s)...
              </p>
            )}

            {videoError && (
              <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl flex items-start gap-2 text-red-300 text-xs animate-in fade-in">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{videoError}</span>
              </div>
            )}
          </div>

          {/* Media Live Preview Card */}
          {mediaUrl && !videoError && (
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-neutral-950">
              <div className="aspect-video w-full relative flex items-center justify-center bg-black">
                {mediaType === 'video' ? (
                  <>
                    <video
                      src={mediaUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-amber-400/40 text-amber-400 font-mono text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-green-400" />
                      VÍDEO VÁLIDO ({videoDuration ? `${videoDuration.toFixed(1)}s` : '8.0s'} / 8.0s MÁX)
                    </div>
                  </>
                ) : (
                  <img
                    src={mediaUrl}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          )}

          {/* Caption */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider font-mono">
              2. Legenda / O que aconteceu?
            </label>
            <textarea
              required
              rows={3}
              placeholder="Descreva o feito, o treino ou a situação. Peça os votos da comunidade..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>

          {/* Hashtags */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider font-mono flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              3. Tags (separadas por espaço)
            </label>
            <input
              type="text"
              placeholder="#GymSigma #AuraGain #Disciplina #W"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-amber-300 focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!!videoError || !mediaUrl}
              className="flex-1 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed text-black font-extrabold text-xs shadow-xl shadow-amber-400/20 hover:scale-[1.02] active:scale-95 transition-transform"
            >
              Publicar {mediaType === 'video' ? 'Vídeo (8s)' : 'Foto'} no Feed
            </button>
          </div>
        </form>

        {/* Live Anime Aura Camera Studio Modal */}
        {isCameraStudioOpen && (
          <AnimeAuraCameraStudio
            onCaptureVideo={handleCaptureFromStudio}
            onCancel={() => setIsCameraStudioOpen(false)}
          />
        )}
      </div>
    </div>
  );
};
