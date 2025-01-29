import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

// Initialize FFmpeg instance
const ffmpeg = createFFmpeg({ log: true });

/**
 * Compresses a video file using FFmpeg
 * @param {File} videoFile - The video file to compress
 * @param {Function} onProgress - Optional callback for compression progress
 * @returns {Promise<Blob>} Compressed video as a Blob
 */
export async function compressVideo(videoFile, onProgress = () => {}) {
  try {
    // Load FFmpeg if not already loaded
    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }

    // Set up progress handling
    ffmpeg.setProgress(({ ratio }) => {
      onProgress(Math.round(ratio * 100));
    });

    // Write the input file to FFmpeg's file system
    await ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videoFile));

    // Run compression command
    await ffmpeg.run(
      '-i', 'input.mp4',
      '-c:v', 'libx264',    // Video codec
      '-crf', '23',         // Compression quality (18-28, lower = better)
      '-preset', 'medium',  // Compression speed
      '-c:a', 'aac',       // Audio codec
      '-b:a', '128k',      // Audio bitrate
      'output.mp4'
    );

    // Read the compressed file
    const data = ffmpeg.FS('readFile', 'output.mp4');
    
    // Clean up
    ffmpeg.FS('unlink', 'input.mp4');
    ffmpeg.FS('unlink', 'output.mp4');

    // Return as blob
    return new Blob([data.buffer], { type: 'video/mp4' });
  } catch (error) {
    console.error('Compression error:', error);
    throw new Error('Video compression failed');
  }
}

/**
 * Captures a frame from a video file at a specified time
 * @param {File} videoFile - The video file to capture from
 * @param {number} timeInSeconds - Time in seconds to capture the frame
 * @returns {Promise<Blob>} Screenshot as a PNG Blob
 */
export async function captureVideoFrame(videoFile, timeInSeconds = 0) {
  try {
    // Load FFmpeg if not already loaded
    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }

    // Write the input file to FFmpeg's file system
    await ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videoFile));

    // Capture frame
    await ffmpeg.run(
      '-i', 'input.mp4',
      '-ss', timeInSeconds.toString(),  // Seek to specified time
      '-frames:v', '1',                 // Capture single frame
      '-f', 'image2',                   // Force image format
      'screenshot.png'                  // Output filename
    );

    // Read the captured frame
    const data = ffmpeg.FS('readFile', 'screenshot.png');
    
    // Clean up
    ffmpeg.FS('unlink', 'input.mp4');
    ffmpeg.FS('unlink', 'screenshot.png');

    // Return as blob
    return new Blob([data.buffer], { type: 'image/png' });
  } catch (error) {
    console.error('Screenshot capture error:', error);
    throw new Error('Frame capture failed');
  }
}