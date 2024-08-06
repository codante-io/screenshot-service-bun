import axios from 'axios';
import fs from 'fs';
import { write } from 'bun';

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
  const file540p = files.find((file) => file.height === 240);

  if (!file540p) {
    throw new Error('No 540p file found for this video');
  }

  const downloadUrl: string = file540p.link;

  const downloadResponse = await axios({
    url: downloadUrl,
    method: 'GET',
    responseType: 'arraybuffer',
  });

  await Bun.write('video.mp4', downloadResponse.data);

  console.log('Video downloaded from Vimeo');
}
