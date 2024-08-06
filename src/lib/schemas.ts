import { z } from 'zod';

export const screenshotRequestSchema = z.object({
  url: z.string(),
  fileName: z
    .string({ message: 'fileName must be a string' })
    .min(1, 'fileName is required'),
});

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
];

export const imageRequestSchema = z.object({
  submission_image: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported.'
    ),
  submission_path: z.string().min(1, 'submission_path is required'),
});

export const screenshotPutRequestSchema = z.object({
  url: z.string(),
  fileName: z
    .string({ message: 'fileName must be a string' })
    .min(1, 'fileName is required'),
  oldFilename: z.string().min(1, 'oldFilename is required'),
});

export const vimeoVideoRequestSchema = z.object({
  vimeoUrl: z.string().min(1, 'vimeoUrl is required'),
});
