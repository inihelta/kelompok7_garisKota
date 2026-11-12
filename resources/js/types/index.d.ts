import { Config, RouteParamWithQueryString, RouteParamsWithQueryString } from 'ziggy-js';

export interface User {
    id: number;
    name?: string;
    email: string;
    email_verified_at?: string;
    role?: string;
}

export interface FlashMessages {
    success?: string;
    error?: string;
    [key: string]: string | undefined;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User | null;
    };
    flash: FlashMessages;
    errors: Record<string, string | string[]>;
};

declare global {
    var route: ((
        name?: string,
        params?: RouteParamsWithQueryString | RouteParamWithQueryString,
        absolute?: boolean,
        config?: Config,
    ) => string);
}