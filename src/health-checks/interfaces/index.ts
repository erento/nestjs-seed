export interface HealthResponse {
    environment: string;
    health: HealthDetails;
    version: string;
}

export interface HealthDetails {
    databases: {[key: string]: string};
    services: string[];
}
