import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

let ffmpeg = null;

export async function compressVideo(file, options = {}) {
  if (!file) throw new Error("No file provided");

  const {
    crf = 23,
    preset = 'medium',
    onProgress = () => {}
  } = options;

  try {
    // Lazy initialize FFmpeg
    if (!ffmpeg) {
      ffmpeg = new FFmpeg();
      ffmpeg.on('progress', ({ progress }) => {
        onProgress(progress);
      });
    }

    if (!ffmpeg.loaded) {
      await ffmpeg.load();
    }

    const inputFileName = file.name || 'input.mp4';
    const outputFileName = 'output.mp4';

    // Write input file to FFmpeg file system
    const fileData = await fetchFile(file);
    await ffmpeg.writeFile(inputFileName, fileData);

    // Compress video with H.264 settings
    await ffmpeg.exec([
      '-i', inputFileName,
      '-c:v', 'libx264',        // H.264 video codec
      '-crf', crf.toString(),   // Quality setting
      '-preset', preset,        // Compression preset
      '-profile:v', 'main',     // H.264 profile
      '-level', '4.0',          // H.264 level
      '-pix_fmt', 'yuv420p',    // Pixel format for compatibility
      '-movflags', '+faststart', // Enable fast start for web playback
      '-c:a', 'aac',            // Audio codec
      '-b:a', '128k',           // Audio bitrate
      '-ac', '2',               // Stereo audio
      outputFileName
    ]);

    // Read compressed file
    const data = await ffmpeg.readFile(outputFileName);

    // Cleanup
    await ffmpeg.deleteFile(inputFileName);
    await ffmpeg.deleteFile(outputFileName);

    // Return compressed file
    return new File(
      [data],
      'compressed_' + (file.name || 'video.mp4'),
      { type: 'video/mp4' }
    );

  } catch (error) {
    console.error('Video compression error:', error);
    return null;
  }
}

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

export const extractImageFromVideo = async (videoFile, outputImageName = "output.webp", time = '00:00:01') => {
  const ffmpeg = createFFmpeg({ log: true });

  // Load FFmpeg
  await ffmpeg.load();

  // Write the video file to FFmpeg's virtual file system
  ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videoFile));

  // Run FFmpeg to extract a frame at the given time
  await ffmpeg.run(
    '-i', 'input.mp4',        // Input video file
    '-ss', time,              // Time to capture the frame (e.g., 1 second)
    '-frames:v', '1',         // Extract only one frame
    outputImageName           // Output image file name
  );

  // Read the output image
  const data = ffmpeg.FS('readFile', outputImageName);
  // Convert the Uint8Array to a Blob for download or preview
  return new Blob([data.buffer], { type: 'image/jpeg' });
};