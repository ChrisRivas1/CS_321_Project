import { useState } from "react";
function EditProfile({ userid, onSave, onCancel }){
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
    const [selectedRelationships, setselectedRelationships] = useState([]);
    function toggleRelationships(relationship){
        if(selectedRelationships.includes(relationship)){
            setselectedRelationships(selectedRelationships.filter(item => item !== relationship));
        }
        else{
           setselectedRelationships([...selectedRelationships, relationship]); 
        }
    }

    const [selectedLanguages, setSelectedLanguages] = useState([]);
    function toggleLanguages(language){
        if(selectedLanguages.includes(language)){
            setSelectedLanguages(selectedLanguages.filter(item => item !== language));
        }
        else{
           setSelectedLanguages([...selectedLanguages, language]); 
        }
    }

    async function save(){
        try{
            /**api call for relationships*/
            const relationshipsResponse = await fetch(`http://localhost:8000/users/${userid}/relationships`,
                {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        preferences: selectedRelationships
                    })
                });
            if (!relationshipsResponse.ok){
                throw new Error("Failed to save changes to relationships");
            }

            /**api call for languages*/
            const languagesResponse = await fetch(`http://localhost:8000/users/${userid}/languages`,
                {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        preferences: selectedLanguages
                    })
                });
            if (!languagesResponse.ok){
                throw new Error("Failed to save changes to languages");
            }
            await onSave();
        } catch (error){
            console.error("Failed to save changes", error);
            alert("Failed to save changes");
        }
    }
    
    return(<div className="editProfilePage">
        <div className="card">
        <div className="profileEditButtons">
            <button className="editProfileButton" onClick={onCancel}>Cancel</button>
            <button className="editProfileButton" onClick={save}>Save</button>
        </div>
        <h2>Edit Profile</h2>
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
                            onClick={() => toggleRelationships(relationship)}
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
                            onClick={() => toggleLanguages(language)}
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