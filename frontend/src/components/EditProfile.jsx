import { useState, Fragment } from "react";
function EditProfile({ userid, currentInterests, currentRelationships, 
                    currentLanguages, currentAvailability, onSave, onCancel }){

    const days = [
        "Monday", "Tuesday", "Wednesday","Thursday",
        "Friday", "Saturday", "Sunday"
    ];

    const periods = [
        "Morning", "Afternoon", "Evening", "Night"
    ];

    const interests = [
        "Tennis", "Basketball", "Film", "Music",
        "Soccer", "Dance", "Fitness", "Travel", 
        "Cooking", "Books", "Anime", "Art",
        "Technology", "Hiking", "Traveling",
        "Cycling", "Yoga", "Running", "Fishing",
        "Photography", "Fashion", "Chess", "Gardening",
        "Bowling"
    ];

    const languages = [
        "English", "Chinese", "Hindi",
        "Spanish", "Arabic", "Persian", "French",
        "Bengali", "Portuguese", "Urdu", "Vietnamese", 
        "Japanese", "Russian", "German", "Italian"
    ];
    
    const relationships = [
        "Friend", "Sports Partner", "Music Partner",
        "Activity Partner", "Study Partner", "Gaming Partner",
        "Networking", "Language Exchange Partner"
    ];

    const [selectedSlots, setSelectedSlots] = useState(
        currentAvailability.map((slot) => `${slot.day} ${slot.period}`)
    );
    const [selectedInterests, setSelectedInterests] = useState(currentInterests);
    const [selectedRelationships, setSelectedRelationships] = useState(currentRelationships);
    const [selectedLanguages, setSelectedLanguages] = useState(currentLanguages);

    function toggle(list, setList, item){
        if(list.includes(item)){
            setList(list.filter(i => i !== item));
        }
        else{
           setList([...list, item]); 
        }
    }

    async function post(path, body){
        const response = await fetch(`http://localhost:8000/users/${userid}/${path}`,
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        });
        if(!response.ok){
            throw new Error(`Failed to save changes to ${path}`);
        }
    }

    async function save(){
        try{
            await post("interests", { interests: selectedInterests });
            await post("relationships", { preferences: selectedRelationships });
            await post("languages", { preferences: selectedLanguages });
            await post("availability",
            {
                availability: selectedSlots.map((slot) => {
                    const [day, period] = slot.split(" ");
                    return { day: day, period: period };
                })
            });
            await onSave();
        } catch (error){
            console.error("Failed to save changes", error);
            alert(error.message);
        }
    }
    
    return(<div className="editProfilePage">
        <div className="card">
        <div className="profileEditButtons">
            <button className="editProfileButton" onClick={onCancel}>Cancel</button>
            <button className="editProfileButton" 
                onClick={save}
                disabled={selectedInterests.length === 0}
            >Save</button>
        </div>
        <h2>Edit Profile</h2>
        <div className="profileSection">
            <h3>My Availability</h3>
            <div className="editAvailabilityGrid">
                {days.map((day) => (
                    <Fragment key={day}>
                        <h4>{day}</h4>
                        {periods.map((period) => (
                            <button type="button"
                                key={period}
                                className={
                                    selectedSlots.includes(`${day} ${period}`) ? "profileTag selected" : "profileTag"
                                }
                                onClick={() => toggle(selectedSlots, setSelectedSlots, `${day} ${period}`)}
                            >{period}
                            </button>
                        ))}
                    </Fragment>
                ))}
            </div>
        </div>
        <div className="profileSection">
            <h3>My Interests</h3>
            <div className="preferencesSection">
                {selectedInterests.length === 0 && <p>Select at least one interest</p>}
                <div className="tagList">
                    {interests.map((interest) => (
                        <button type="button"
                            key={interest}
                            className={
                                selectedInterests.includes(interest) ? "profileTag selected" : "profileTag"
                            }
                            onClick={() => toggle(selectedInterests, setSelectedInterests, interest)}
                        >{interest}
                        </button>
                    ))}
                </div>
            </div>
        </div>
        <div className="profileSection">
            <h3>My Preferences</h3>
            <div className="preferencesSection">
                <h4>Relationship Types</h4>
                <div className="tagList">
                    {relationships.map((relationship) => (
                        <button type="button"
                            key={relationship}
                            className={
                                selectedRelationships.includes(relationship) ? "profileTag selected" : "profileTag"
                            }
                            onClick={() => toggle(selectedRelationships, setSelectedRelationships, relationship)}
                        >{relationship}
                        </button>
                    ))}
                </div>
            </div>
            <div className="preferencesSection">
                <h4>Languages</h4>
                <div className="tagList">
                    {languages.map((language) => (
                        <button type="button"
                            key={language}
                            className={
                                selectedLanguages.includes(language) ? "profileTag selected" : "profileTag"
                            }
                            onClick={() => toggle(selectedLanguages, setSelectedLanguages, language)}
                        >{language}
                        </button>
                    ))}
                </div>
            </div>
        </div>
        </div>
    </div>);
}
export default EditProfile;