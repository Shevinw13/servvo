import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { MediaService } from '../../src/modules/media/media.service';

// Mock the AWS SDK modules
jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn().mockImplementation(() => ({})),
  GetObjectCommand: jest.fn().mockImplementation((input) => input),
}));

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest
    .fn()
    .mockResolvedValue('https://s3.amazonaws.com/bucket/key?signed=true'),
}));

describe('MediaService', () => {
  let service: MediaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediaService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, defaultValue?: string) => {
              const config: Record<string, string> = {
                AWS_REGION: 'us-east-1',
                AWS_S3_BUCKET: 'test-bucket',
                AWS_ACCESS_KEY_ID: 'test-key-id',
                AWS_SECRET_ACCESS_KEY: 'test-secret-key',
              };
              return config[key] || defaultValue || '';
            }),
          },
        },
      ],
    }).compile();

    service = module.get<MediaService>(MediaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSignedUrl', () => {
    it('should return a signed URL with expiresIn', async () => {
      const result = await service.getSignedUrl('photos/appointment-123/lawn.jpg');

      expect(result).toHaveProperty('url');
      expect(result).toHaveProperty('expiresIn');
      expect(result.expiresIn).toBe(3600);
      expect(typeof result.url).toBe('string');
      expect(result.url).toContain('https://');
    });

    it('should call getSignedUrl with correct bucket and key', async () => {
      const { getSignedUrl: mockGetSignedUrl } = require('@aws-sdk/s3-request-presigner');
      const { GetObjectCommand } = require('@aws-sdk/client-s3');

      await service.getSignedUrl('photos/test-key.jpg');

      expect(GetObjectCommand).toHaveBeenCalledWith({
        Bucket: 'test-bucket',
        Key: 'photos/test-key.jpg',
      });
      expect(mockGetSignedUrl).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ Bucket: 'test-bucket', Key: 'photos/test-key.jpg' }),
        { expiresIn: 3600 },
      );
    });
  });
});
