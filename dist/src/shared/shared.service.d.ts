/// <reference types="node" />
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthTokenPayload } from 'src/lib/types';
export declare class SharedService {
    private config;
    private jwtService;
    constructor(config: ConfigService, jwtService: JwtService);
    hashPassword(data: string | Buffer): Promise<string>;
    veryfyJwtToken(token: string): Promise<Record<string, unknown>>;
    signPayload(payload: string | Buffer | AuthTokenPayload): string;
    comparePassword(password: string, hashedPassword: string): Promise<boolean>;
    isTokenExpired(createdAt: Date, options: {
        expiresInHHours?: number;
        expiresInSeconds?: number;
    }): Promise<boolean>;
}
