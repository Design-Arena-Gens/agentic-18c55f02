'use client';

import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [playbackRate, setPlaybackRate] = useState<number>(0.25);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
    }
  };

  const handleDownload = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsProcessing(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Capture current frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Download as image
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `slowmo-frame-${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
      setIsProcessing(false);
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Slow Motion
          </h1>
          <p className="text-xl text-gray-300">
            Upload a video and watch it in stunning slow motion
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {!videoUrl ? (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20">
              <label className="flex flex-col items-center justify-center cursor-pointer">
                <div className="w-32 h-32 mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <span className="text-2xl font-semibold mb-2">Upload Video</span>
                <span className="text-gray-400">Click to select or drag and drop</span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-black rounded-2xl overflow-hidden shadow-2xl">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  controls
                  className="w-full"
                  loop
                />
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <label className="block mb-4">
                  <span className="text-lg font-semibold mb-3 block">
                    Playback Speed: {playbackRate}x
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">0.1x</span>
                    <input
                      type="range"
                      min="0.1"
                      max="2"
                      step="0.05"
                      value={playbackRate}
                      onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                      className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <span className="text-sm text-gray-400">2x</span>
                  </div>
                </label>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setPlaybackRate(0.1)}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
                  >
                    Ultra Slow (0.1x)
                  </button>
                  <button
                    onClick={() => setPlaybackRate(0.25)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
                  >
                    Slow (0.25x)
                  </button>
                  <button
                    onClick={() => setPlaybackRate(0.5)}
                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
                  >
                    Half (0.5x)
                  </button>
                  <button
                    onClick={() => setPlaybackRate(1)}
                    className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
                  >
                    Normal (1x)
                  </button>
                </div>

                <button
                  onClick={handleDownload}
                  disabled={isProcessing}
                  className="w-full mt-6 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105 disabled:scale-100"
                >
                  {isProcessing ? 'Processing...' : 'Capture Frame'}
                </button>

                <button
                  onClick={() => {
                    setVideoFile(null);
                    setVideoUrl('');
                    setPlaybackRate(0.25);
                  }}
                  className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all"
                >
                  Upload New Video
                </button>
              </div>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <div className="mt-12 text-center text-gray-400">
          <p className="text-sm">
            All processing happens in your browser. Your videos are never uploaded to any server.
          </p>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(to right, #a855f7, #ec4899);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(to right, #a855f7, #ec4899);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
        }
      `}</style>
    </main>
  );
}
