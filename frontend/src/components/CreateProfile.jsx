import { useState } from "react";
function CreateProfile({ onSave }){
    /*part 1 is creation screen
    part 2 is interests selection screen*/
    const [part, setPart] = useState(1);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [email, setEmail] = useState("");

    const interests = [
        "Tennis", "Basketball", "Film", "Music",
        "Soccer", "Dance", "Fitness", "Travel", 
        "Cooking", "Books", "Anime", "Art",
        "Technology", "Hiking", "Traveling",
        "Cycling", "Yoga", "Running", "Fishing",
        "Photography", "Fashion", "Chess", "Gardening",
        "Bowling"
    ];
    const [selectedInterests, setSelectedInterests] = useState([]);
    function toggleInterests(interest){
        if(selectedInterests.includes(interest)){
            setSelectedInterests(selectedInterests.filter(item => item !== interest));
        }
        else{
           setSelectedInterests([...selectedInterests, interest]); 
        }
    }

    async function saveProfile() {
        try{
            const response = await fetch("http://localhost:8000/users",{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    username: username,
                    email: email,
                    name: name,
                    age: Number(age),
                    selectedInterests: selectedInterests
                })
            });
            if (!response.ok){
                throw new Error("Failed to create profile");
            }
            const data = await response.json();
            onSave(data.userid);
        } catch (error){
            console.error("Failed to create profile", error);
            alert("Failed to create profile. Try again");
        }
    }

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
                <input type="email"
                    placeholder="EMAIL"
                    value={email}
                    onChange={(e) =>{setEmail(e.target.value)}}
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
        <div className="interestsScreen">
            <h2>Select Your Interests</h2>
            <input type="text"
                placeholder="Search Interests"
            />
            <div className="interestsGrid">
                {interests.map((interest) => (
                    <button type="button"
                        key={interest}
                        className={
                            selectedInterests.includes(interest) ? "interest selected" : "interest"
                        }
                        onClick={() => toggleInterests(interest)}
                        >{interest}
                    </button>
                ))}
            </div>
            <div className="interestsNav">
                <button onClick={() => setPart(1)}>BACK</button>
                <button type="button"
                    onClick={saveProfile}
                    disabled={selectedInterests.length === 0}
                >SAVE</button>
            </div>
        </div>
    )}
    </div>)
}
export default CreateProfile;