import {Field, Label, Input} from "@headlessui/react";
import {FormEvent, useState} from "react";
import {useAuth} from "../../services/auth/AuthContext.tsx";
import {LoaderCircle} from "lucide-react";
import {Link} from "react-router-dom";

function SignUp() {
    const {signUp, authState} = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [wasSuccess, setWasSuccess] = useState(false);

    const handleSignup = async (e: FormEvent) => {
        e.preventDefault();
        setWasSuccess(await signUp(email, password));
    }

    return <div className="flex flex-col items-center">
        <div className="w-96 bg-white bg-opacity-85 rounded-lg shadow-lg px-5 py-5">
            {wasSuccess ?
                <div>
                    Your account was created. You can now <Link to="/login">Login</Link>.
                </div> :
                <form onSubmit={handleSignup} className="flex flex-col space-y-5">
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
                            <LoaderCircle className="inline-block animate-spin"/> :
                            'Create Account'}
                    </button>
                    {authState.error && <div className="text-red-500">{authState.error}</div>}
                </form>}
        </div>

    </div>
}

export default SignUp;