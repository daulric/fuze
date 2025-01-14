import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

// Create FFmpeg instance outside the function but initialize it lazily
let ffmpeg = null;

export async function compressVideo(file) {
  if (!file) throw new Error("No file provided");
  
  try {
    // Lazy initialize FFmpeg
    if (!ffmpeg) {
      ffmpeg = new FFmpeg();
    }

    if (!ffmpeg.loaded) {
      await ffmpeg.load();
    }

    // Ensure file has a valid name
    const inputFileName = file.name || 'input.mp4';
    const outputFileName = 'output.mp4';

    // Convert file for FFmpeg
    const fileData = await fetchFile(file);

    // Write input file to FFmpeg file system
    await ffmpeg.writeFile(inputFileName, fileData);

    // Compress video
    await ffmpeg.exec([
      '-i', inputFileName,
      '-vcodec', 'libx264',
      '-crf', '28',
      outputFileName
    ]);

    // Read compressed file from FFmpeg file system
    const data = await ffmpeg.readFile(outputFileName);

    // Cleanup files from memory
    await ffmpeg.deleteFile(inputFileName);
    await ffmpeg.deleteFile(outputFileName);

    // Return compressed file
    return new File([data], 'compressed_' + (file.name || 'video.mp4'), { type: 'video/mp4' });
  } catch (error) {
    console.error('Video compression error:', error);
    return null;
  }
}