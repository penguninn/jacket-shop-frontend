export interface BaseMutationOptions {
    setError?: (name: string, error: { message: string }) => void;
}