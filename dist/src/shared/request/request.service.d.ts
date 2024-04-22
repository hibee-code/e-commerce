import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class RequestService {
    private readonly requestApi;
    private configService;
    constructor(requestApi: HttpService, configService: ConfigService);
    requestAuth(path: string, { query, body, headers, method, baseURL, }?: {
        body?: Record<string, unknown>;
        query?: Record<string, unknown>;
        headers?: {
            Authorization?: string;
        };
        method?: 'POST' | 'GET' | 'PUT' | 'DELETE';
        baseURL?: string;
    }): Promise<Pick<import("axios").AxiosResponse<any, any>, "headers" | "data" | "request" | "status">>;
}
