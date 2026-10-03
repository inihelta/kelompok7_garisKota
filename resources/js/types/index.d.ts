import { Config, RouteParamWithQueryString, RouteParamsWithQueryString } from 'ziggy-js';

export interface User {
    id: number;
    name?: string;
    email: string;
    email_verified_at?: string;
    [key: string]: any;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User | null;
    };
    errors: Record<string, string | string[]>;
};

declare global {
    var route: ((
        name?: string,
        params?: RouteParamsWithQueryString | RouteParamWithQueryString,
        absolute?: boolean,
        config?: Config,
    ) => any);
}
