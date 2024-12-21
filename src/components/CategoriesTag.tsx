import {Plus, X} from "lucide-react";
import {FormEvent, useEffect, useRef, useState} from "react";

type Props = {
    categories: string[],
    onChange: (value: string[]) => void,
    alwaysShowInput?: boolean,
};

function CategoriesTag({categories, onChange, alwaysShowInput}: Props) {
    const [showInput, setShowInput] = useState(false);
    const [newCategory, setNewCategory] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (showInput && inputRef.current) {
            inputRef.current.focus();
        }
    }, [showInput]);

    function handleRemove(index: number) {
        const newCategories = categories.slice();
        newCategories.splice(index, 1);
        onChange(newCategories);
    }

    function toggleInput() {
        if (alwaysShowInput) return;
        setNewCategory("");
        setShowInput(!showInput);
    }

    function handleAdd(e: FormEvent) {
        e.preventDefault();
        const newCategories = categories.slice();
        newCategories.push(newCategory)
        onChange(newCategories);
        setNewCategory("");
        toggleInput();
    }

    return <div className="flex flex-wrap text-sm group/parent">
        {categories.map((category, i) =>
            <button key={i}
                    onClick={() => handleRemove(i)}
                    className="bg-shakespeare-400 rounded-sm text-white px-2 flex items-center group/button relative h-5 mr-2 hover:mr-5 transition-all"
            >
                {category}
                <div className="absolute flex items-center h-5 top-1/2 right-0 bg-shakespeare-400 translate-x-3 -translate-y-1/2 z-10 rounded-sm opacity-0 group-hover/button:opacity-100 transition">
                    <X size={16} />
                </div>
            </button>
        )}
        {(showInput || alwaysShowInput) ?
            <form onSubmit={handleAdd}>
                <input type="text" placeholder="Category" value={newCategory}
                       className="outline-none bg-white bg-opacity-0 w-full"
                       ref={inputRef} onBlur={toggleInput}
                       onChange={e => setNewCategory(e.target.value)}/>
            </form> :
            <button onClick={toggleInput}
                    className="hidden group-hover/parent:flex text-gray-400 hover:text-gray-500 transition space-x-2 items-center"
            >
                <Plus size={16} /> Add
            </button>}
    </div>;
}

export default CategoriesTag;