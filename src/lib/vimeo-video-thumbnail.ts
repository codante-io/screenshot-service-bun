import axios, { AxiosError, AxiosResponse } from 'axios';
import Ffmpeg from 'fluent-ffmpeg';
import { S3 } from './s3';
import { nanoid } from 'nanoid';
import { createLogger, transports, format } from 'winston';
import { unlink } from 'node:fs/promises';

// Initialize logger
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(
      ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`
    )
  ),
  transports: [new transports.Console()],
});

const vimeoAccessToken: string | undefined = process.env.VIMEO_SECRET;

if (!vimeoAccessToken) {
  throw new Error('VIMEO_SECRET environment variable is not set');
}

export async function handle(
  vimeoID: string,
  startTime: string
): Promise<{ videoUrl: string }> {
  const videoAPIUrl: string = `https://api.vimeo.com/videos/${vimeoID}`;

  let response: AxiosResponse | null = null;
  try {
    response = await axios({
      url: videoAPIUrl,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${vimeoAccessToken}`,
      },
    });
  } catch (e: any) {
    if (e.response?.status === 404) {
      throw new Error('Video not found on Vimeo');
    }

    if (e.response.status !== 200) {
      throw new Error('Error fetching video from Vimeo');
    }
  }

  const files: { height: number; link: string }[] = response?.data?.files;

  if (!files) {
    throw new Error('No files found for this video');
  }

  const file540p = files.find((file) => file.height === 540);

  if (!file540p) {
    throw new Error('No 540p file found for this video');
  }
  const downloadUrl: string = file540p.link;
  const downloadResponse = await fetch(downloadUrl);

  await Bun.write('tmp/video.mp4', downloadResponse);

  logger.info('Video downloaded! Processing video...');

  const videoHash = nanoid();
  const videoUrl = await processVideo(
    'tmp/video.mp4',
    'tmp/processed-video.mp4',
    async () =>
      saveToAWS(
        'tmp/processed-video.mp4',
        `workshops/cover-videos/${videoHash}.mp4`
      ),
    startTime
  );

  // remove temp files
  await unlink('tmp/video.mp4');
  await unlink('tmp/processed-video.mp4');

  return videoUrl;
}

async function saveToAWS(
  videoPath: string,
  uploadPath: string
): Promise<string> {
  try {
    const videoArrBuffer = await Bun.file(videoPath).arrayBuffer();
    const videoBuffer = Buffer.from(videoArrBuffer);
    logger.info(`Saving to AWS: ${videoPath}`);
    const s3 = new S3();
    const { videoUrl } = await s3.uploadVideo(uploadPath, videoBuffer);
    logger.info('Video saved to AWS!');
    logger.info(`Video URL: ${videoUrl}`);
    return videoUrl;
  } catch (error: any) {
    logger.error(`Error saving video to AWS: ${error.message}`);
    throw error;
  }
}

export async function processVideo(
  inputPath: string,
  outputPath: string,
  callback: () => Promise<string>,
  startTime: string
): Promise<{ videoUrl: string }> {
  logger.info('Processing video...');
  logger.info(`Input Path: ${inputPath}`);
  logger.info(`Output Path: ${outputPath}`);
  logger.info(`StartTime: ${startTime}`);

  // time format is 00:00:00 (HH:MM:SS)
  const startTimeInSeconds = startTime
    .split(':')
    .reduce((acc, time) => acc * 60 + parseInt(time), 0);

  logger.info(`StartTime in seconds: ${startTimeInSeconds}`);

  return new Promise((resolve, reject) => {
    Ffmpeg(inputPath)
      .setStartTime(startTimeInSeconds)
      .setDuration(5)
      .noAudio()
      .output(outputPath)
      .on('end', () => {
        callback()
          .then((videoUrl) => resolve({ videoUrl }))
          .catch((error) => reject(error));
      })
      .on('error', (err: any) => {
        logger.error(`Error processing video: ${err.message}`);
        reject(err);
      })
      .run();
  });
}
