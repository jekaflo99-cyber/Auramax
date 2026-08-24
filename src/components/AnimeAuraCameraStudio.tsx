import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  Video, 
  Check, 
  X, 
  AlertCircle, 
  RefreshCw,
  Sliders,
  Layers,
  Cpu,
  Zap
} from 'lucide-react';
import { VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE } from '../utils/animeShaders';

export type AnimeAuraFilter = 
  | 'none'
  | 'super_saiyan'      // Dragon Ball: Golden Spiky Ki Flames + SSJ2 Violet/Blue Lightning
  | 'ultra_instinct'    // Dragon Ball: Silver Divine Ethereal Mist + Stardust
  | 'super_saiyan_blue' // Dragon Ball: Cyan/Blue God Ki Flames
  | 'getsuga_tenshou'   // Bleach: Crimson & Black Hollow Reiatsu
  | 'bankai_purple'     // Bleach: Dark Violet Spiritual Pressure Vortex
  | 'berserk_red';      // Anime Rage: Blood Red Energy Spikes

interface AnimeAuraCameraStudioProps {
  onCaptureVideo: (videoBlob: Blob, videoDataUrl: string, durationSeconds: number, filterUsed: string) => void;
  onCancel: () => void;
}

const FILTER_PRESETS: {
  id: AnimeAuraFilter;
  modeIndex: number;
  name: string;
  anime: string;
  description: string;
  icon: string;
  badgeColor: string;
  themeColor: string;
}[] = [
  {
    id: 'super_saiyan',
    modeIndex: 0,
    name: 'Super Saiyan 2 Ki',
    anime: 'Dragon Ball Z',
    description: 'Chamas douradas pontiagudas, núcleo branco-quente colado à silhueta e raios SSJ2.',
    icon: '⚡',
    badgeColor: 'bg-amber-400 text-black border-amber-300',
    themeColor: '#facc15'
  },
  {
    id: 'ultra_instinct',
    modeIndex: 1,
    name: 'Ultra Instinct (Migatte)',
    anime: 'Dragon Ball Super',
    description: 'Névoa divina prateada e cintilação celestial fluindo ao redor da tua silhueta.',
    icon: '✨',
    badgeColor: 'bg-sky-200 text-slate-900 border-white',
    themeColor: '#e0f2fe'
  },
  {
    id: 'super_saiyan_blue',
    modeIndex: 2,
    name: 'SSJ Blue (God Ki)',
    anime: 'Dragon Ball Super',
    description: 'Chamas de Ki divino azul ciano com pulso eletromagnético colado ao corpo.',
    icon: '💎',
    badgeColor: 'bg-cyan-500 text-black border-cyan-300',
    themeColor: '#06b6d4'
  },
  {
    id: 'getsuga_tenshou',
    modeIndex: 3,
    name: 'Getsuga Tenshō (Hollow)',
    anime: 'Bleach',
    description: 'Pressão espiritual negra e carmesim envolvendo a silhueta com corte de lâmina.',
    icon: '⚔️',
    badgeColor: 'bg-red-700 text-white border-red-500',
    themeColor: '#ef4444'
  },
  {
    id: 'bankai_purple',
    modeIndex: 4,
    name: 'Bankai Reiatsu',
    anime: 'Bleach',
    description: 'Vórtice denso de pressão espiritual roxa e ondas de energia mística ao redor do tronco.',
    icon: '🔮',
    badgeColor: 'bg-purple-600 text-white border-purple-400',
    themeColor: '#a855f7'
  },
  {
    id: 'berserk_red',
    modeIndex: 5,
    name: 'Berserk Rage Mode',
    anime: 'Anime Classic',
    description: 'Fúria carmesim pontiaguda com distorção de calor e relâmpagos de alta adrenalina.',
    icon: '🩸',
    badgeColor: 'bg-rose-900 text-rose-100 border-rose-600',
    themeColor: '#f43f5e'
  },
  {
    id: 'none',
    modeIndex: 6,
    name: 'Câmara Pura (Sem Filtro)',
    anime: 'Realidade',
    description: 'Gravação limpa sem efeitos visuais sobrepostos.',
    icon: '📷',
    badgeColor: 'bg-neutral-800 text-neutral-300 border-white/10',
    themeColor: '#a3a3a3'
  }
];

export const AnimeAuraCameraStudio: React.FC<AnimeAuraCameraStudioProps> = ({
  onCaptureVideo,
  onCancel
}) => {
  // State
  const [selectedFilter, setSelectedFilter] = useState<AnimeAuraFilter>('super_saiyan');
  const [auraIntensity, setAuraIntensity] = useState<number>(0.9);
  const [auraSpread, setAuraSpread] = useState<number>(32); // Radius in pixels for spiky flame reach
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isAiSegmentationReady, setIsAiSegmentationReady] = useState<boolean>(false);

  // Recording State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordSeconds, setRecordSeconds] = useState<number>(0);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

  // Canvas & WebGL References
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const videoTextureRef = useRef<WebGLTexture | null>(null);
  const maskTextureRef = useRef<WebGLTexture | null>(null);
  const uniformLocationsRef = useRef<Record<string, WebGLUniformLocation | null>>({});

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const recordIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const selfieSegmentationRef = useRef<any>(null);
  const isSegmentingRef = useRef<boolean>(false);
  const hasValidMaskRef = useRef<boolean>(false);

  // Time reference (Deterministic uTime, resets to 0.0 at recording start)
  const uTimeRef = useRef<number>(0);

  // 1. Initialize MediaPipe Selfie Segmentation
  useEffect(() => {
    let isMounted = true;

    const initMediaPipe = async () => {
      try {
        if (!maskCanvasRef.current) {
          maskCanvasRef.current = document.createElement('canvas');
        }

        const checkGlobal = () => {
          return new Promise<any>((resolve) => {
            if ((window as any).SelfieSegmentation) {
              resolve((window as any).SelfieSegmentation);
              return;
            }
            let attempts = 0;
            const interval = setInterval(() => {
              attempts++;
              if ((window as any).SelfieSegmentation) {
                clearInterval(interval);
                resolve((window as any).SelfieSegmentation);
              } else if (attempts > 40) {
                clearInterval(interval);
                resolve(null);
              }
            }, 100);
          });
        };

        const SelfieSegmentationClass = await checkGlobal();
        if (!SelfieSegmentationClass || !isMounted) {
          console.warn('MediaPipe SelfieSegmentation initialized in fallback mode.');
          return;
        }

        const segmenter = new SelfieSegmentationClass({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1.1632782162/${file}`
        });

        segmenter.setOptions({
          modelSelection: 1 // 1 = landscape/full body, 0 = selfie
        });

        segmenter.onResults((results: any) => {
          if (!isMounted) return;
          if (results.segmentationMask && maskCanvasRef.current) {
            const mCanvas = maskCanvasRef.current;
            if (mCanvas.width !== results.segmentationMask.width || mCanvas.height !== results.segmentationMask.height) {
              mCanvas.width = results.segmentationMask.width;
              mCanvas.height = results.segmentationMask.height;
            }
            const mCtx = mCanvas.getContext('2d');
            if (mCtx) {
              mCtx.drawImage(results.segmentationMask, 0, 0);
              hasValidMaskRef.current = true;
            }
          }
          isSegmentingRef.current = false;
        });

        selfieSegmentationRef.current = segmenter;
        if (isMounted) {
          setIsAiSegmentationReady(true);
        }
      } catch (e) {
        console.warn('MediaPipe initialization warning:', e);
      }
    };

    initMediaPipe();

    return () => {
      isMounted = false;
      if (selfieSegmentationRef.current) {
        try {
          selfieSegmentationRef.current.close();
        } catch (e) {}
      }
    };
  }, []);

  // 2. Initialize WebGL Context and Compiled Shader Program
  const initWebGL = (gl: WebGLRenderingContext) => {
    // Compile Vertex Shader
    const vShader = gl.createShader(gl.VERTEX_SHADER);
    if (!vShader) return false;
    gl.shaderSource(vShader, VERTEX_SHADER_SOURCE);
    gl.compileShader(vShader);
    if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS)) {
      console.error('Vertex Shader Error:', gl.getShaderInfoLog(vShader));
      return false;
    }

    // Compile Fragment Shader
    const fShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fShader) return false;
    gl.shaderSource(fShader, FRAGMENT_SHADER_SOURCE);
    gl.compileShader(fShader);
    if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS)) {
      console.error('Fragment Shader Error:', gl.getShaderInfoLog(fShader));
      return false;
    }

    // Link Program
    const program = gl.createProgram();
    if (!program) return false;
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Shader Program Link Error:', gl.getProgramInfoLog(program));
      return false;
    }

    gl.useProgram(program);
    programRef.current = program;

    // Set Up Full-Screen Quad Buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    // Texture Coordinates (accounting for WebGL Y-flip)
    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    
    // Front camera mirror or normal
    const isUserFacing = facingMode === 'user';
    const u0 = isUserFacing ? 1.0 : 0.0;
    const u1 = isUserFacing ? 0.0 : 1.0;

    const texCoords = new Float32Array([
      u0, 1.0,
      u1, 1.0,
      u0, 0.0,
      u0, 0.0,
      u1, 1.0,
      u1, 0.0,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);

    const aTexCoord = gl.getAttribLocation(program, 'a_texCoord');
    gl.enableVertexAttribArray(aTexCoord);
    gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 0, 0);

    // Cache Uniform Locations
    uniformLocationsRef.current = {
      u_image: gl.getUniformLocation(program, 'u_image'),
      u_mask: gl.getUniformLocation(program, 'u_mask'),
      u_resolution: gl.getUniformLocation(program, 'u_resolution'),
      u_time: gl.getUniformLocation(program, 'u_time'),
      u_filterMode: gl.getUniformLocation(program, 'u_filterMode'),
      u_intensity: gl.getUniformLocation(program, 'u_intensity'),
      u_spread: gl.getUniformLocation(program, 'u_spread'),
      u_hasMask: gl.getUniformLocation(program, 'u_hasMask'),
    };

    // Create Textures
    const createTexture = () => {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      return tex;
    };

    videoTextureRef.current = createTexture();
    maskTextureRef.current = createTexture();

    // Default 1x1 black textures
    const blackPixel = new Uint8Array([0, 0, 0, 255]);
    gl.bindTexture(gl.TEXTURE_2D, videoTextureRef.current);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, blackPixel);
    
    gl.bindTexture(gl.TEXTURE_2D, maskTextureRef.current);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, blackPixel);

    return true;
  };

  // 3. Camera Setup
  const startCamera = async () => {
    try {
      setCameraError(null);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 720 },
          height: { ideal: 1280 }
        },
        audio: true
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch (playErr: any) {
          if (playErr.name !== 'AbortError') {
            console.warn('Camera video play issue:', playErr);
          }
        }
      }

      setCameraActive(true);
    } catch (err: any) {
      console.error('Camera error:', err);
      setCameraError(
        'Não foi possível aceder à câmara e microfone. Certifique-se de que autorizou o acesso no navegador.'
      );
      setCameraActive(false);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (recordIntervalRef.current) {
        clearInterval(recordIntervalRef.current);
      }
    };
  }, [facingMode]);

  // 4. WebGL Render Loop with GPU-Driven SDF, Spiky Ridged Flames and SSJ2 Arcs
  useEffect(() => {
    if (!cameraActive) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    let gl = glRef.current;
    if (!gl) {
      gl = canvas.getContext('webgl', { preserveDrawingBuffer: true, alpha: false });
      if (!gl) {
        console.error('WebGL not supported');
        return;
      }
      glRef.current = gl;
      initWebGL(gl);
    }

    let frameCount = 0;

    const renderLoop = () => {
      if (video.readyState >= video.HAVE_CURRENT_DATA && video.videoWidth > 0 && gl) {
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          gl.viewport(0, 0, canvas.width, canvas.height);
        }

        // Advance continuous deterministic uTime (never random per frame)
        uTimeRef.current += 0.035;
        const uTime = uTimeRef.current;
        frameCount++;

        // Send frame to MediaPipe AI Segmentation every 2 frames
        if (
          selfieSegmentationRef.current &&
          !isSegmentingRef.current &&
          frameCount % 2 === 0
        ) {
          isSegmentingRef.current = true;
          selfieSegmentationRef.current.send({ image: video }).catch(() => {
            isSegmentingRef.current = false;
          });
        }

        const program = programRef.current;
        const uniforms = uniformLocationsRef.current;
        if (program) {
          gl.useProgram(program);

          // Upload Camera Video Frame to Texture Unit 0
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, videoTextureRef.current);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
          if (uniforms.u_image) gl.uniform1i(uniforms.u_image, 0);

          // Upload Mask to Texture Unit 1
          gl.activeTexture(gl.TEXTURE1);
          gl.bindTexture(gl.TEXTURE_2D, maskTextureRef.current);
          if (maskCanvasRef.current && hasValidMaskRef.current) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, maskCanvasRef.current);
            if (uniforms.u_hasMask) gl.uniform1i(uniforms.u_hasMask, 1);
          } else {
            if (uniforms.u_hasMask) gl.uniform1i(uniforms.u_hasMask, 0);
          }
          if (uniforms.u_mask) gl.uniform1i(uniforms.u_mask, 1);

          // Uniforms
          const currentPreset = FILTER_PRESETS.find(f => f.id === selectedFilter) || FILTER_PRESETS[0];
          if (uniforms.u_resolution) gl.uniform2f(uniforms.u_resolution, canvas.width, canvas.height);
          if (uniforms.u_time) gl.uniform1f(uniforms.u_time, uTime);
          if (uniforms.u_filterMode) gl.uniform1i(uniforms.u_filterMode, currentPreset.modeIndex);
          if (uniforms.u_intensity) gl.uniform1f(uniforms.u_intensity, auraIntensity);
          if (uniforms.u_spread) gl.uniform1f(uniforms.u_spread, auraSpread);

          // Draw GPU Call
          gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
      }

      animationFrameId.current = requestAnimationFrame(renderLoop);
    };

    animationFrameId.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [cameraActive, selectedFilter, auraIntensity, auraSpread, facingMode]);

  // 5. Synchronized 8s Video Recording (Deterministic uTime Reset to 0.0)
  const startRecording = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    recordedChunksRef.current = [];
    setRecordSeconds(0);
    setIsRecording(true);
    setRecordedVideoUrl(null);
    setRecordedBlob(null);

    // Reset uTime to 0.0 so the 8s clip starts with pristine flame ignition
    uTimeRef.current = 0.0;

    const canvasStream = canvas.captureStream(30);

    if (mediaStreamRef.current) {
      const audioTracks = mediaStreamRef.current.getAudioTracks();
      if (audioTracks.length > 0) {
        canvasStream.addTrack(audioTracks[0]);
      }
    }

    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : MediaRecorder.isTypeSupported('video/webm')
      ? 'video/webm'
      : 'video/mp4';

    const recorder = new MediaRecorder(canvasStream, {
      mimeType,
      videoBitsPerSecond: 3500000 // 3.5 Mbps high fidelity
    });

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        recordedChunksRef.current.push(e.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: mimeType });
      const videoUrl = URL.createObjectURL(blob);
      setRecordedBlob(blob);
      setRecordedVideoUrl(videoUrl);
      setIsRecording(false);
    };

    mediaRecorderRef.current = recorder;
    recorder.start(100);

    let currentSec = 0;
    recordIntervalRef.current = setInterval(() => {
      currentSec += 0.1;
      setRecordSeconds(parseFloat(currentSec.toFixed(1)));

      if (currentSec >= 8.0) {
        stopRecording();
      }
    }, 100);
  };

  const stopRecording = () => {
    if (recordIntervalRef.current) {
      clearInterval(recordIntervalRef.current);
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleConfirmRecordedVideo = () => {
    if (!recordedBlob || !recordedVideoUrl) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const filterName = FILTER_PRESETS.find(f => f.id === selectedFilter)?.name || 'Anime Filter';
      onCaptureVideo(recordedBlob, dataUrl, recordSeconds || 8.0, filterName);
    };
    reader.readAsDataURL(recordedBlob);
  };

  const currentPreset = FILTER_PRESETS.find(f => f.id === selectedFilter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-neutral-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[95vh]">
        
        {/* Hidden source video */}
        <video ref={videoRef} playsInline muted className="hidden" />

        {/* LEFT / CENTER: Anime Filter Live WebGL Canvas */}
        <div className="relative flex-1 bg-black flex items-center justify-center min-h-[380px] sm:min-h-[480px] overflow-hidden">
          
          {!recordedVideoUrl ? (
            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain max-h-[65vh] md:max-h-[85vh]"
            />
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <video
                src={recordedVideoUrl}
                autoPlay
                loop
                playsInline
                controls
                className="w-full h-full object-contain max-h-[65vh] md:max-h-[85vh]"
              />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-amber-400/40 text-amber-300 font-mono text-xs font-bold flex items-center gap-1.5 shadow-lg">
                <Check className="w-4 h-4 text-green-400" />
                VÍDEO GRAVADO ({recordSeconds.toFixed(1)}s) COM SUCESSO!
              </div>
            </div>
          )}

          {/* Camera Access Error Message */}
          {cameraError && (
            <div className="absolute inset-0 bg-neutral-950/95 flex flex-col items-center justify-center p-6 text-center z-30">
              <AlertCircle className="w-12 h-12 text-red-400 mb-3" />
              <h4 className="text-lg font-bold text-white mb-2">Acesso à Câmara Necessário</h4>
              <p className="text-xs text-neutral-400 max-w-md mb-4">{cameraError}</p>
              <button
                onClick={startCamera}
                className="px-4 py-2 rounded-xl bg-amber-400 text-black font-mono font-bold text-xs flex items-center gap-2 hover:bg-amber-300 transition-all"
              >
                <RefreshCw className="w-4 h-4" /> Tentar Novamente
              </button>
            </div>
          )}

          {/* AI Status Badge */}
          {!recordedVideoUrl && (
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5">
              {selectedFilter !== 'none' && (
                <div className={`px-3 py-1 rounded-full text-xs font-mono font-black uppercase tracking-wider border shadow-xl flex items-center gap-1.5 backdrop-blur-md ${currentPreset?.badgeColor}`}>
                  <span>{currentPreset?.icon}</span>
                  <span>{currentPreset?.name}</span>
                </div>
              )}
              <div className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[9px] font-mono text-neutral-300 flex items-center gap-1">
                <Cpu className={`w-3 h-3 ${isAiSegmentationReady ? 'text-green-400' : 'text-amber-400 animate-spin'}`} />
                <span>{isAiSegmentationReady ? 'IA Silhueta (SDF 16-Tap): Ativa' : 'A carregar IA...'}</span>
              </div>
            </div>
          )}

          {/* Top Controls */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <button
              onClick={() => setFacingMode(prev => prev === 'user' ? 'environment' : 'user')}
              className="p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md transition-transform active:scale-95"
              title="Trocar Câmara Frontal / Traseira"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onCancel}
              className="p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md transition-transform active:scale-95"
              title="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Recording Timer */}
          {isRecording && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
              <div className="px-4 py-1.5 rounded-full bg-red-600/90 text-white font-mono text-xs font-extrabold flex items-center gap-2 shadow-2xl animate-pulse border border-white/40">
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                A GRAVAR: {recordSeconds.toFixed(1)}s / 8.0s
              </div>
              <div className="w-48 h-1.5 rounded-full bg-white/20 overflow-hidden">
                <div 
                  className="h-full bg-amber-400 transition-all duration-100"
                  style={{ width: `${(recordSeconds / 8.0) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Record Trigger Button */}
          {!recordedVideoUrl && !isRecording && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
              <button
                onClick={startRecording}
                disabled={!cameraActive}
                className="w-16 h-16 rounded-full bg-red-600 border-4 border-white shadow-[0_0_30px_rgba(220,38,38,0.8)] hover:scale-105 active:scale-90 transition-transform flex items-center justify-center group disabled:opacity-40"
              >
                <span className="w-6 h-6 rounded-full bg-white group-hover:scale-90 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {/* RIGHT: Filters & Controls */}
        <div className="w-full md:w-80 bg-neutral-900 border-t md:border-t-0 md:border-l border-white/10 p-5 flex flex-col justify-between overflow-y-auto max-h-[45vh] md:max-h-[85vh]">
          
          {!recordedVideoUrl ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
                  <Sparkles className="w-4 h-4" />
                  Motor GPU Shaders
                </div>
                <h3 className="text-base font-black uppercase tracking-tight text-white">
                  Aura Anime (SDF + Ridged Noise)
                </h3>
                <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                  Chamas pontiagudas (ridged noise), núcleo branco-quente na silhueta e raios SSJ2 sem pintar sobre o corpo.
                </p>
              </div>

              {/* Sliders for Radius & Intensity */}
              <div className="p-3 rounded-2xl bg-neutral-950 border border-white/5 space-y-2.5">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-neutral-400 flex items-center gap-1">
                      <Sliders className="w-3.5 h-3.5 text-amber-400" />
                      Intensidade do Ki
                    </span>
                    <span className="text-amber-300 font-bold">{Math.round(auraIntensity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.3"
                    max="1.0"
                    step="0.05"
                    value={auraIntensity}
                    onChange={(e) => setAuraIntensity(parseFloat(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-neutral-400 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-cyan-400" />
                      Extensão das Chamas (SDF)
                    </span>
                    <span className="text-cyan-300 font-bold">{auraSpread}px</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="60"
                    step="2"
                    value={auraSpread}
                    onChange={(e) => setAuraSpread(parseInt(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Preset List */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider font-mono">
                  Escolhe o Teu Modo de Ki:
                </label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-none">
                  {FILTER_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedFilter(preset.id)}
                      className={`w-full p-2.5 rounded-2xl text-left border transition-all flex items-center justify-between gap-3 ${
                        selectedFilter === preset.id
                          ? 'bg-amber-400/15 border-amber-400 ring-1 ring-amber-400/40 text-white shadow-lg'
                          : 'bg-neutral-950 border-white/5 text-neutral-400 hover:border-white/20 hover:text-neutral-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{preset.icon}</span>
                        <div>
                          <div className="text-xs font-extrabold font-mono text-white flex items-center gap-1.5">
                            <span>{preset.name}</span>
                          </div>
                          <span className="text-[10px] text-amber-400/90 font-mono block">
                            {preset.anime}
                          </span>
                        </div>
                      </div>
                      {selectedFilter === preset.id && (
                        <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 my-auto">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-green-500/20 border border-green-500/40 text-green-400 mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-base font-black text-white uppercase font-mono">
                  Clipe Renderizado com Sucesso!
                </h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  O teu vídeo de <strong>{recordSeconds.toFixed(1)}s</strong> com a aura <strong>{currentPreset?.name}</strong> gerada por GPU shaders está pronto para o feed.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-950 border border-white/10 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-neutral-400">
                  <span>Duração:</span>
                  <span className="text-amber-400 font-bold">{recordSeconds.toFixed(1)}s (Dentro dos 8s)</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Filtro de Silhueta:</span>
                  <span className="text-white font-bold">{currentPreset?.name}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            {!recordedVideoUrl ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold font-mono transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={!cameraActive}
                  className={`flex-1 py-3 rounded-xl font-mono font-extrabold text-xs transition-transform active:scale-95 flex items-center justify-center gap-1.5 shadow-lg ${
                    isRecording
                      ? 'bg-red-500 hover:bg-red-400 text-white shadow-red-500/30'
                      : 'bg-amber-400 hover:bg-amber-300 text-black shadow-amber-400/20'
                  }`}
                >
                  <Video className="w-4 h-4" />
                  {isRecording ? 'Parar' : 'Gravar 8s'}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleConfirmRecordedVideo}
                  className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs font-mono transition-transform active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-amber-400/30"
                >
                  <Check className="w-4 h-4" />
                  Usar Este Vídeo no Post
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRecordedVideoUrl(null);
                    setRecordedBlob(null);
                    setRecordSeconds(0);
                  }}
                  className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-mono text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Gravar Novamente
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
