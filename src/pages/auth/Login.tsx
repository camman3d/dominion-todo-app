import {Field, Label, Input} from "@headlessui/react";
import {FormEvent, useState} from "react";
import {useAuth} from "../../services/auth/AuthContext.tsx";
import {LoaderCircle} from "lucide-react";
import {Link, Navigate} from "react-router-dom";

function Login() {
    const {signIn, authState} = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        await signIn(email, password)
    }

    if (authState.user)
        return <Navigate to="/app" />;

    return <div className="flex flex-col items-center">
        <form onSubmit={handleLogin} className="w-96 bg-white bg-opacity-85 rounded-lg shadow-lg px-5 py-5 flex flex-col space-y-5">
            <Field>
                <Label className="text-sm/6 font-medium">Email</Label>
                <Input type="email"
                       className="mt-3 block w-full rounded-lg border border-gray-400 bg-black/5 shadow-inner py-1.5 px-3 text-sm/6 text-gray-500 focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                       value={email} onChange={(e) => setEmail(e.target.value)}
                />
            </Field>
            <Field>
                <Label className="text-sm/6 font-medium">Password</Label>
                <Input type="password"
                       className="mt-3 block w-full rounded-lg border border-gray-400 bg-black/5 shadow-inner py-1.5 px-3 text-sm/6 text-gray-500 focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                       value={password} onChange={(e) => setPassword(e.target.value)}
                />
            </Field>
            <button type="submit" disabled={authState.loading}
                    className="bg-shakespeare-500 hover:bg-shakespeare-400 active:bg-aquamarine-500 transition text-white text-sm/6 py-2 rounded-md disabled:pointer-events-none disabled:opacity-50"
            >
                {authState.loading ?
                    <LoaderCircle className="inline-block animate-spin" /> :
                    'Log In'}
            </button>
            <div>
                <Link to="/signup" className="text-sm/4 text-shakespeare-600 hover:underline">Create an account</Link>
            </div>
            {authState.error && <div className="text-red-500">{authState.error}</div>}
        </form>
    </div>
}

export default Login;