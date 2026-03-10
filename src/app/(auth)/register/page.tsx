import AuthContainer from '@/components/custom/AuthContainer';

export const metadata = {
    title: 'Create Account | Dentara',
    description: 'Join the Dentara network.',
};

export default function RegisterPage() {
    return <AuthContainer initialView="register" />;
}
