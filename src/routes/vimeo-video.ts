import { Hono } from 'hono';
import { S3 } from '../lib/s3';
import { vimeoVideoValidator } from '../lib/hono-validators';
import { downloadVimeoVideo } from '../lib/video';
import ffmpeg from 'fluent-ffmpeg';

const app = new Hono();

app.post('/', vimeoVideoValidator(), async (c) => {
  const { vimeoUrl } = c.req.valid('json');

  const inputPath = 'input.mp4';
  const outputPath = 'output.mp4';

  try {
    const s3 = new S3();
    // Baixar o vídeo do Vimeo
    await downloadVimeoVideo(vimeoUrl, inputPath);

    //   // Iniciar o processamento do vídeo com FFmpeg
    //   ffmpeg(inputPath)
    //     .setStartTime('00:00:00') // Usa startTime se fornecido, caso contrário, usa '00:00:00'
    //     .setDuration(5)
    //     .noAudio()
    //     .output(outputPath)
    //     .on('end', async () => {
    //       try {
    //         const videoPath = 'output.mp4';

    //         const videoArrBuffer = await Bun.file(videoPath).arrayBuffer();
    //         const videoBuffer = Buffer.from(videoArrBuffer);
    //         const { videoUrl } = await s3.uploadVideo(videoPath, videoBuffer);

    //         c.json(
    //           {
    //             message: 'Video salvo na S3 com sucesso!',
    //             videoUrl,
    //           },
    //           200
    //         );
    //       } catch (err) {
    //         console.error('Erro ao salvar video na AWS', err);
    //         c.json(
    //           {
    //             message: 'Ocorreu um erro ao tentar salvar o vídeo na AWS',
    //             error: err,
    //           },
    //           500
    //         );
    //       }
    //     })
    //     .on('error', (err: any) => {
    //       console.error(err);
    //       c.json(err.message || 'Error processing the video', 500);
    //     })
    //     .run();
    return c.json({ message: 'Video downloaded from Vimeo' }, 200);
  } catch (err) {
    console.error(err);
    c.json({ message: 'Error downloading the video' }, 500);
  }
});

export default app;
