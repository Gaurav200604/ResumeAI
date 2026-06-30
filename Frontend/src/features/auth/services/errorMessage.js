export function getAuthErrorMessage(error, fallback) {
    const data = error?.response?.data;
    const firstValidationError = data?.errors?.[0]?.message;

    return firstValidationError || data?.message || data?.error || fallback;
}
