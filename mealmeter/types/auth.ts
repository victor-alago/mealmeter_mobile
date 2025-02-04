export interface AuthResponse {
    idToken: string;
    refreshToken: string;
    email: string;
}

export interface AuthError {
    detail: string;
} 