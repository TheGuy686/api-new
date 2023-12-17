export interface SerializedConnectionI {
    secure: boolean;
    devIsSecure: boolean;
    hostName: string;
    externalHostName: string;
    protocol: string;
    host: string;
    alias: string;
    ip: string;
    local: string;
    port: number;
    fullUrl: string;
}