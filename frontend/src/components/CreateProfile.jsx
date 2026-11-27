
import { useState, Fragment } from "react";

function CreateProfile({ onSave }){
    /*part 1 is creation screen
    part 2 is availability selection screen
    part 3 is interests selection screen*/
    const [part, setPart] = useState(1);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [email, setEmail] = useState("");
    const [saving, setSaving] = useState(false);

    const days = [
        "Monday", "Tuesday", "Wednesday","Thursday",
        "Friday", "Saturday", "Sunday"
    ];

    const periods = [
        "Morning", "Afternoon", "Evening", "Night"
    ];
    const [selectedSlots, setSelectedSlots] = useState([]);
    function toggleSlot(day, period){
        const slot = `${day} ${period}`;
        if(selectedSlots.includes(slot)){
            setSelectedSlots(selectedSlots.filter(item => item !== slot));
        }
        else{
           setSelectedSlots([...selectedSlots, slot]);
        }
    }

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
        if (saving) return;

        setSaving(true);
        let userid;

        try{
            const response = await fetch("http://localhost:8000/users",{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    username: username,
                    email: email,
                    name: name,
                    age: Number(age),
                    selectedInterests: selectedInterests,
                    password: password
                })
            });

            if (!response.ok){
                if (response.status === 409) {
                    throw new Error("Username or email already exists.");
                }

                if (response.status === 422) {
                    throw new Error("Please check your profile information and password.");
                }

                throw new Error("Failed to create profile.");
            }

            const data = await response.json();
            userid = data.userid;

        } catch (error){
            console.error("Failed to create profile", error);
            alert(error.message);
            setSaving(false);
            return;
        }

        if(selectedSlots.length > 0){
            try{
                const availabilityResponse = await fetch(`http://localhost:8000/users/${userid}/availability`,{
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        availability: selectedSlots.map((slot) => {
                            const [day, period] = slot.split(" ");
                            return { day: day, period: period };
                        })
                    })
                });

                if(!availabilityResponse.ok){
                    throw new Error("Failed to save availability");
                }

            } catch (error){
                console.error("Failed to save availability", error);
                alert("Profile successfully created. Failed to save availability");
            }
        }

        setSaving(false);
        onSave(userid);
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
                    autoComplete="username"
                    required
                />
                <input type="email"
                    placeholder="EMAIL"
                    value={email}
                    onChange={(e) =>{setEmail(e.target.value)}}
                    autoComplete="email"
                    required
                />
                <input type="password"
                    placeholder="PASSWORD (MINIMUM 8 CHARACTERS)"
                    value={password}
                    onChange={(e) =>{setPassword(e.target.value)}}
                    autoComplete="new-password"
                    minLength={8}
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
            <h2>Select Your Availability</h2>
            <div className="availabilityGrid">
                {days.map((day) => (
                    <Fragment key={day}>
                    <div className="gridLabel">{day}</div>
                    {periods.map((period) => (
                        <button type="button"
                            key={period}
                            className={
                                selectedSlots.includes(`${day} ${period}`) ? "interest selected" : "interest"
                            }
                            onClick={() => toggleSlot(day, period)}
                            >{period}
                        </button>
                    ))}
                    </Fragment>
                ))}
            </div>
            <div className="interestsNav">
                <button type="button" onClick={() => setPart(1)}>BACK</button>
                <button type="button" onClick={() => setPart(3)}>NEXT</button>
            </div>
        </div>
    )}
    {part == 3 && (
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
                <button type="button" onClick={() => setPart(2)}>BACK</button>
                <button type="button"
                    onClick={saveProfile}
                    disabled={selectedInterests.length === 0 || saving}
                >
                    {saving ? "SAVING..." : "SAVE"}
                </button>
            </div>
        </div>
    )}
    </div>)
}

export default CreateProfile;
