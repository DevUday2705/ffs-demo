import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Initialize user (calls your wrapper API)
export function useInitializeUser(reqno) {
    return useQuery({
        queryKey: ['user', reqno],
        queryFn: async () => {
            const response = await fetch('/api/initialize-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reqno }),
            });
            if (!response.ok) throw new Error('Failed to initialize user');
            return response.json();
        },
        enabled: !!reqno,
        staleTime: 5 * 60 * 1000,
        retry: 2,
    });
}




// Send OTP
export function useSendOTP() {
    return useMutation({
        mutationFn: async (encryptedID) => {
            const response = await fetch('/api/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ encryptedID }),
            });
            if (!response.ok) throw new Error('Failed to send OTP');
            return response.json();
        },
    });
}
export function useResendOTP() {
    return useMutation({
        mutationFn: async (decryptedID) => {
            const response = await fetch('/api/resend-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ decryptedID }),
            });
            if (!response.ok) throw new Error('Failed to send OTP');
            return response.json();
        },
    });
}

// Validate OTP
export function useValidateOTP() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ reqNo, otp }) => {
            const response = await fetch('/api/validate-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reqNo, otp }),
            });
            if (!response.ok) throw new Error('Failed to validate OTP');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
    });
}

// Dashboard data
export function useDashboardData(reqNo) {
    return useQuery({
        queryKey: ['dashboard', reqNo],
        queryFn: async () => {
            const response = await fetch('/api/dashboard-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reqNo }),
            });
            if (!response.ok) throw new Error('Failed to fetch dashboard data');
            return response.json();
        },
        enabled: !!reqNo,
        staleTime: 10 * 60 * 1000,
    });
}


export function useUploadDocument() {
    return useMutation({
        mutationFn: async (uploadData) => {
            const response = await fetch('/api/upload-document', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(uploadData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to upload document');
            }
            return response.json();
        },
    });
}

export function useGetDocs() {
    return useMutation({
        mutationFn: async (reqNo) => {
            const response = await fetch('/api/get-docs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reqNo }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch documents');
            }
            return response.json();
        },
    });
}