import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { fromEnv } from '@aws-sdk/credential-provider-env';
import { Upload } from '@aws-sdk/lib-storage';
import { nanoid } from 'nanoid';

export class S3 {
  private client: S3Client;
  private region: string;

  constructor() {
    this.client = new S3Client({
      credentials: fromEnv(),
      region: process.env.AWS_REGION ?? 'sa-east-1',
    });

    this.region = process.env.AWS_REGION ?? 'sa-east-1';
  }

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
      const imageUrl = `https://${params.Bucket}.s3.${this.region}.amazonaws.com/${params.Key}`;
      return { imageUrl };
    } catch (e: any) {
      e.message = `S3 upload error: ${e.message}`;
      throw e;
    }
  }
}
