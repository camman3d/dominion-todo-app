import promptApi, {Prompt} from "../services/prompt-api.ts";
import AISpark from "../assets/AISparkWhite.svg";
import {useState} from "react";
import {LoaderCircle} from "lucide-react";
import {Task} from "../services/tasks/api.ts";
import queryClient from "../services/queryClient.ts";

type Props = {
    task: Task,
    prompt: Prompt,
};

function AiButton({prompt, task}: Props) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    async function handleClick() {
        setMessage('');
        setLoading(true);
        const result = await promptApi.apply(prompt.id, task.id)
        if (!result.success) {
            setMessage(result.message || 'Unsuccessful');
        }
        setLoading(false);
        queryClient.invalidateQueries({queryKey: ['taskPrompts']});
    }

    return <>
        <button onClick={handleClick}
                disabled={loading}
                className="rounded bg-gradient-to-br from-amber-500 to-yellow-500 text-white py-1 px-3 flex space-x-1 shadow-lg border border-amber-600 border-opacity-0 hover:border-opacity-100 relative disabled:pointer-events-none disabled:opacity-75"
        >
            <img src={AISpark} alt="AI Action" className={'w-5 ' + (loading ? 'opacity-0' : '')}/>
            <div className={loading ? 'opacity-0' : ''}>{prompt.description}</div>
            {loading && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <LoaderCircle className="animate-spin"/>
            </div>}
        </button>
        {message && <div className="text-red-500">{message}</div>}
    </>
}

export default AiButton;