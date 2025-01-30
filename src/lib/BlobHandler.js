import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from "@ffmpeg/util";

// Initialize FFmpeg instance
const ffmpeg = new FFmpeg();
 // Load FFmpeg once globally

export async function compressVideo(videoFile) {
  try {
    
    if (!ffmpeg.loaded) {
      await ffmpeg.load();
    }

    // Write the input file to FFmpeg's virtual file system
    await ffmpeg.writeFile('input.mp4', await fetchFile(videoFile));

    // Run compression command
    await ffmpeg.exec([
      '-i', 'input.mp4',
      '-c:v', 'libx264',    // Video codec
      '-crf', '23',         // Compression quality (18-28, lower = better)
      '-preset', 'medium',  // Compression speed
      '-c:a', 'aac',       // Audio codec
      '-b:a', '128k',      // Audio bitrate
      'output.mp4'
    ]);

    // Read the compressed file
    const data = await ffmpeg.readFile('output.mp4');

    // Clean up
    await ffmpeg.deleteFile('input.mp4');
    await ffmpeg.deleteFile('output.mp4');

    console.log("finished compressing");
    // Return as blob
    return new Blob([data], { type: 'video/mp4' });
  } catch (error) {
    console.error('Compression error:', error);
    throw new Error('Video compression failed');
  }
}

export async function captureVideoFrame(videoFile, timeInSeconds = 0) {
  try {
    
    if (!ffmpeg) {
      ffmpeg = new FFmpeg();
    }
    
    if (!ffmpeg.loaded) {
      await ffmpeg.load();
    }
    
    // Write the input file to FFmpeg's virtual file system
    await ffmpeg.writeFile('input.mp4', await fetchFile(videoFile));

    // Capture frame
    await ffmpeg.exec([
      '-i', 'input.mp4',
      '-ss', timeInSeconds.toString(),
      '-frames:v', '1',
      'screenshot.png'
    ]);

    // Read the captured frame
    const data = await ffmpeg.readFile('screenshot.png');

    // Clean up
    await ffmpeg.deleteFile('input.mp4');
    await ffmpeg.deleteFile('screenshot.png');

    return new Blob([data], { type: 'image/png' });
  } catch (error) {
    console.error('Screenshot capture error:', error);
    throw new Error('Frame capture failed');
  }
}