import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { fromEnv } from '@aws-sdk/credential-provider-env';

export type imgMimes =
  | 'image/jpeg'
  | 'image/jpg'
  | 'image/png'
  | 'image/webp'
  | 'image/avif';

interface UploadParams {
  path: string;
  buffer: Buffer;
  contentType?: imgMimes;
}

export class S3 {
  private client: S3Client;
  private bucketName: string;
  private assetsBaseUrl: string;

  constructor() {
    const bucketName = process.env.AWS_BUCKET_NAME;
    const assetsBaseUrl = process.env.CODANTE_ASSETS_BASE_URL;

    if (!bucketName || !assetsBaseUrl) {
      throw new Error(
        'AWS_BUCKET_NAME and CODANTE_ASSETS_BASE_URL must be defined.'
      );
    }

    this.client = new S3Client({
      credentials: fromEnv(),
      region: process.env.AWS_REGION ?? 'sa-east-1',
    });

    this.bucketName = bucketName;
    this.assetsBaseUrl = assetsBaseUrl;
  }

  // this method uploads the webp image to the S3 bucket and returns the URL
  async uploadImage({
    path,
    buffer,
    contentType = 'image/webp',
  }: UploadParams): Promise<{ imageUrl: string }> {
    // check if the path is valid
    this.checkImagePath(path);

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME ?? '',
      Key: path,
      Body: buffer,
      ContentType: contentType,
    };

    try {
      await this.client.send(new PutObjectCommand(params));
      return { imageUrl: `${this.assetsBaseUrl}/${path}` };
    } catch (e: any) {
      e.message = `S3 upload error: ${e.message}`;
      throw e;
    }
  }

  async deleteImage(imagePath: string): Promise<void> {
    // remove the base url
    imagePath = this.removeBaseUrl(imagePath);

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME ?? '',
      Key: imagePath,
    };

    // remove the base url

    try {
      await this.client.send(new DeleteObjectCommand(params));
    } catch (e: any) {
      e.message = `S3 delete error: ${e.message}`;
      throw e;
    }
  }

  async uploadVideo(videoPath: string, buffer: Buffer) {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME ?? '',
      Key: videoPath,
      Body: buffer,
      ContentType: 'video/mp4',
    };

    try {
      await this.client.send(new PutObjectCommand(params));
      const videoUrl = `${process.env.CODANTE_ASSETS_BASE_URL}/${params.Key}`;
      return { videoUrl };
    } catch (e: any) {
      e.message = `S3 upload error: ${e.message}`;
      throw e;
    }
  }

  removeBaseUrl(imageUrl: string): string {
    try {
      new URL(imageUrl); // Check if it's a valid URL
      const url = new URL(imageUrl);
      return url.pathname.substring(1); // Remove leading '/' from the pathname
    } catch (error) {
      return imageUrl; // Return the original if not a valid URL
    }
  }

  private checkImagePath(path: string): void {
    if (!path) {
      throw new Error('Image path is required');
    }

    const validExtensions = /\.(avif|webp|jpg|jpeg|png)$/i;
    if (!validExtensions.test(path)) {
      throw new Error(
        'Invalid image path. Must end with a valid image extension (avif, webp, jpg, jpeg, png, gif).'
      );
    }
  }
}
