import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: any,
    folder = 'courses',
  ): Promise<{
    url: string;
    thumbnailPublicId: string;
  }> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,

          resource_type: 'image',

          allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],

          transformation: [
            {
              quality: 'auto',
              fetch_format: 'auto',
            },
          ],
        },

        (error, result) => {
          if (error || !result) {
            return reject(
              new InternalServerErrorException('Image upload failed'),
            );
          }

          resolve({
            url: result.secure_url,
            thumbnailPublicId: result.public_id,
          });
        },
      );

      stream.end(file.buffer);
    });
  }

  async deleteImage(publicId: string) {
    if (!publicId) return;

    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Cloudinary delete failed:', error);
    }
  }
}
