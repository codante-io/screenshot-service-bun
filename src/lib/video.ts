import axios from 'axios';
import Ffmpeg from 'fluent-ffmpeg';
import { S3 } from './s3';

const vimeoAccessToken: string | undefined = process.env.VIMEO_SECRET;

export async function downloadVimeoVideo(
  vimeoUrl: string,
  outputPath: string
): Promise<void> {
  const videoId: string = vimeoUrl.split('/').pop()!;
  const videoAPIUrl: string = `https://api.vimeo.com/videos/${videoId}`;

  console.log(videoAPIUrl);

  const response = await axios({
    url: videoAPIUrl,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${vimeoAccessToken}`,
    },
  });

  const files: { height: number; link: string }[] = response.data.files;
  const file540p = files.find((file) => file.height === 540);

  if (!file540p) {
    throw new Error('No 540p file found for this video');
  }

  const downloadUrl: string = file540p.link;

  const downloadResponse = await fetch(downloadUrl);
  await Bun.write('video.mp4', downloadResponse);
  await processVideo('video.mp4', 'processed-video.mp4');
}

export async function processVideo(
  inputPath: string,
  outputPath: string
): Promise<{ videoUrl: string }> {
  return new Promise((resolve, reject) => {
    const s3 = new S3();
    Ffmpeg(inputPath)
      .setStartTime('00:00:00')
      .setDuration(5)
      .noAudio()
      .output(outputPath)
      .on('end', async () => {
        try {
          const videoPath = 'teste/output.mp4';
          const videoArrBuffer = await Bun.file(videoPath).arrayBuffer();
          const videoBuffer = Buffer.from(videoArrBuffer);
          const { videoUrl } = await s3.uploadVideo(videoPath, videoBuffer);
          console.log({ videoUrl });
          resolve({ videoUrl });
        } catch (err) {
          console.error('Erro ao salvar video na AWS', err);
          reject(err);
        }
      })
      .on('error', (err: any) => {
        console.error(err);
        reject(err);
      })
      .run();
  });
}
