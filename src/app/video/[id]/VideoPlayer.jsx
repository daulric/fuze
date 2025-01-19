import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Rewind, FastForward } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import getBlob from '@/lib/getBlob';

const VideoPlayer = ({ isCommenting, videoData}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const [tempUrls, setTempUrls] = useState(null);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleSeek = useCallback((newValue) => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = newValue;
      setCurrentTime(newValue);
    }
  }, []);

  const handleVolumeChange = useCallback((newValue) => {
    const video = videoRef.current;
    if (video) {
      video.volume = newValue;
      setVolume(newValue);
      setIsMuted(newValue === 0);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      if (isMuted) {
        video.volume = volume;
        setIsMuted(false);
      } else {
        video.volume = 0;
        setIsMuted(true);
      }
    }
  }, [isMuted, volume]);

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    const video_player = videoRef.current;
    
    if (!container || !video_player) return;
    
    if (container.requestFullscreen) {
      if (!document.fullscreenElement) {
        container.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    } else if (video_player.webkitEnterFullscreen) {
      // iOS Safari specific fullscreen API
      if (!isFullscreen) {
        video_player.webkitEnterFullscreen();
        setIsFullscreen(true);
      } else {
        video_player.webkitExitFullscreen();
        setIsFullscreen(false);
      }
    } else {
      console.warn("Fullscreen is not supported in this browser.");
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  }, []);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'arrowleft':
          e.preventDefault();
          handleSeek(Math.max(currentTime - 10, 0));
          break;
        case 'arrowright':
          e.preventDefault();
          handleSeek(Math.min(currentTime + 10, duration));
          break;
        case 'arrowup':
          e.preventDefault();
          handleVolumeChange(Math.min(volume + 0.1, 1));
          break;
        case 'arrowdown':
          e.preventDefault();
          handleVolumeChange(Math.max(volume - 0.1, 0));
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
      }
    };
    
    if (!isCommenting) {
      document.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [togglePlay, toggleFullscreen, handleSeek, currentTime, duration, handleVolumeChange, volume, toggleMute, isCommenting]);

  useEffect(() => {
    async function getBlobData() {
      const data = await getBlob(videoData);
      setTempUrls(data);
    }
    
    getBlobData();
    
    return () => {
      setTempUrls(null);
    }
  }, [videoData]);
  
  const formatTime = (time) => {
    if (!isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  function handleLoadedData(e) {
    if (!isLoaded) {
      setDuration(e.target.duration);
      setIsLoaded(true);
    }
    
    if (e.target.duration !== duration) {
      setDuration(e.target.duration);
    }
    
    if (isPlaying) {
      togglePlay()
    }
  }

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full bg-black"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={() => togglePlay()}
    >
      <video
        ref={videoRef}
        playsInline
        preload='auto'
        className="w-full h-full object-contain"
        onContextMenu={(e) => e.preventDefault()}
        controlsList='nodownload'
        onClick={togglePlay}
        poster={tempUrls?.thumb_url}
        aria-label="Video player"
        src={tempUrls?.video_url}
        onEnded={() => togglePlay()}
        onTimeUpdate={(e) => {
          setCurrentTime(e.target.currentTime)
        }}
        onLoadedData={(e) => {
          if (tempUrls) {
            URL.revokeObjectURL(tempUrls.video_url);
            URL.revokeObjectURL(tempUrls.thumb_url);
          }
          
          handleLoadedData(e);
        }}
      >
      unable to play video lol ;)
      </video>
      <div className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={(newValue) => handleSeek(newValue[0])}
            className="mb-4"
            aria-label="Video progress"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={() => handleSeek(Math.max(currentTime - 10, 0))} className="text-white hover:text-white hover:bg-white/20" aria-label="Rewind 10 seconds">
                <Rewind className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={togglePlay} className="text-white hover:text-white hover:bg-white/20" aria-label={isPlaying ? "Pause" : "Play"}>
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleSeek(Math.min(currentTime + 10, duration))} className="text-white hover:text-white hover:bg-white/20" aria-label="Forward 10 seconds">
                <FastForward className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white hover:text-white hover:bg-white/20" aria-label={isMuted ? "Unmute" : "Mute"}>
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.01}
                onValueChange={(newValue) => handleVolumeChange(newValue[0])}
                className="w-24"
                aria-label="Volume"
              />
              {isLoaded && (
                <span className="text-white text-xs">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white hover:text-white hover:bg-white/20" aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}>
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;