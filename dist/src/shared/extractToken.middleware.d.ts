import { NestMiddleware } from '@nestjs/common';
import { PlatformRequest } from 'src/lib/types';
import { SharedService } from './shared.service';
export declare class ExtractTokenMiddleWare implements NestMiddleware {
    private sharedService;
    constructor(sharedService: SharedService);
    use(req: PlatformRequest, _: Response, next: (error?: any) => void): Promise<void>;
}
