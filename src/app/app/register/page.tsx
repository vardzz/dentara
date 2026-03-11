import AuthContainer from '@/components/custom/AuthContainer';

export const metadata = {
    title: 'Create Account | Dentara',
    description: 'Join the Dentara network as a student or patient.',
};

export default function RegisterPage() {
    return <AuthContainer initialView="register" />;
}
