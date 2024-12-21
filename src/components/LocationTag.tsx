import {MapPin} from "lucide-react";
import {ChangeEvent, useEffect, useState} from "react";
import useDebounce from "../services/debounce.ts";

type Props = {
    location: string,
    onChange: (location: string) => void,
};

function LocationTag(props: Props) {
    const [location, setLocation] = useState(props.location);
    const onChange = useDebounce(props.onChange, 500);

    useEffect(() => {
        setLocation(props.location);
    }, [props.location]);

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setLocation(e.target.value);
        onChange(e.target.value);
    }

    return <div className="flex space-x-1 text-sm items-center text-gray-400">
        <MapPin className="scale-[60%]"/>
        <input type="text" placeholder="Location"
               value={location} onChange={handleChange}
               className="w-full bg-white bg-opacity-0 outline-none" />
    </div>
}

export default LocationTag;