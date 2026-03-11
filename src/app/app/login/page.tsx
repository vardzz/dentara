import AuthContainer from '@/components/custom/AuthContainer';

export const metadata = {
    title: 'Sign In | Dentara',
    description: 'Access your Dentara portal.',
};

export default function LoginPage() {
    return <AuthContainer initialView="login" />;
}
