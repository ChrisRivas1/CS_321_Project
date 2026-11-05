import { useState } from "react";
function CreateProfile(){
    /*part 1 is creation screen
    part 2 is interests selection screen*/
    const [part, setPart] = useState(1);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    return(
    <div className="createProfile">
    {part == 1 && (
        <div className="profileCreationScreen">
            <h2>Create Profile</h2>
            <form onSubmit={(e) => {e.preventDefault(); setPart(2);}}>
                <div className="profileCreationInputs">
                <input type="text"
                placeholder="USERNAME"
                value={username}
                onChange={(e) =>{setUsername(e.target.value)}}
                required
                />
                <input type="password"
                placeholder="PASSWORD"
                value={password}
                onChange={(e) =>{setPassword(e.target.value)}}
                required
                />
                <input type="text"
                placeholder="NAME"
                value={name}
                onChange={(e) =>{setName(e.target.value)}}
                required
                />
                <input type="number"
                placeholder="AGE"
                min={18}
                value={age}
                onChange={(e) =>{setAge(e.target.value)}}
                required
                />
                <button type="submit">NEXT</button>
                </div>
            </form>
        </div>
    )}
    {part == 2 && (
        <div>

        </div>
    )}
    </div>)
}
export default CreateProfile;