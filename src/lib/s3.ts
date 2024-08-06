import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { fromEnv } from '@aws-sdk/credential-provider-env';
import { nanoid } from 'nanoid';

export class S3 {
  private client: S3Client;

  constructor() {
    this.client = new S3Client({
      credentials: fromEnv(),
      region: process.env.AWS_REGION ?? 'sa-east-1',
    });
  }

  // this method uploads the webp image to the S3 bucket and returns the URL
  async uploadImage(
    imagePath: null | string = null,
    buffer: Buffer
  ): Promise<{ imageUrl: string }> {
    // Add .webp extension to the file name if it doesn't have it
    if (imagePath && !imagePath.endsWith('.webp')) imagePath += '.webp';

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME ?? '',
      Key: imagePath ? `${imagePath}` : `${nanoid()}.webp`,
      Body: buffer,
      ContentType: 'image/webp',
    };

    try {
      await this.client.send(new PutObjectCommand(params));

      // get the URL of the uploaded image
      const imageUrl = `${process.env.CODANTE_ASSETS_BASE_URL}/${params.Key}`;
      return { imageUrl };
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
}
