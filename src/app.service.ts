import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class AppService {
  async getVideo(req: any, res: any) {
    const videoPath = path.resolve( __dirname,
      '../video/pexels-valeriia-miller-6040389.mp4',
    );
    const { size } = fs.statSync(videoPath);
    const range = req.headers.range;

    if (range) {
      const [start, end] = range.replace('bytes=', '').split('-');
      const newEnd = end || size - 1;
      const headers = {
              'Content-Length': Number(newEnd) - Number(start) + 1,
              'Content-Type': 'video/mp4',
              'Content-Range': `bytes ${start}-${end}/${size}`,
              'Accept-Ranges': 'bytes',
            }

      const stream = fs.createReadStream(videoPath, {
        start: Number(start),
        end: Number(newEnd),
      });
      stream.pipe(res);
    } else {
        const headers = {
          'Content-Type': 'video/mp4',
          'Content-Length': size,
        };
        res.writeHead(200, headers);
        fs.createReadStream(videoPath).pipe(res);
    }
  }
  }

