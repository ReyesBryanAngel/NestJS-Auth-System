import { Injectable } from '@nestjs/common';
import * as whois from 'whois';

@Injectable()
export class WhoisService {
  async lookup(domain: string): Promise<any> {
    return new Promise((resolve, reject) => {
      whois.lookup(domain, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
}
