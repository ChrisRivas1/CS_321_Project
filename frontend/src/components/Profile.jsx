import { useState, useEffect } from 'react'
import EditProfile from "./EditProfile"
import ProfileAssistant from "./ProfileAssistant";

function Profile({ userid }){
    const [profile, setProfile] = useState(null);
    const [relationships, setRelationships] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [editing, setEditing] = useState(false);
    const [availability, setAvailability] = useState([]);
    
    async function loadProfile() {
        try{
            /**api call for user info */
            const profileResponse = await fetch(`http://localhost:8000/users/${userid}`);
            if (!profileResponse.ok){
                throw new Error("Failed to load profile");
            }
            const data = await profileResponse.json();
            setProfile(data);
                
            /**api call for user relationship preferences */
            const relationshipsResponse = await fetch(`http://localhost:8000/users/${userid}/relationships`);
            if (!relationshipsResponse.ok){
                throw new Error("Failed to load relationship preferences");
            }
            const relationshipsData = await relationshipsResponse.json();
            setRelationships(relationshipsData.preferences);

            /**api call for user language preferences */
            const languagesResponse = await fetch(`http://localhost:8000/users/${userid}/languages`);
            if (!languagesResponse.ok){
                throw new Error("Failed to load language preferences");
            }
            const languagesData = await languagesResponse.json();
            setLanguages(languagesData.preferences);

            /**api call for user availability */
            const availabilityResponse = await fetch(`http://localhost:8000/users/${userid}/availability`);
            if (!availabilityResponse.ok){
                throw new Error("Failed to load availability");
            }
            const availabilityData = await availabilityResponse.json();
            setAvailability(availabilityData.availability);

        } catch (error){
            console.error("Failed to load profile", error);
            alert(error.message);
        }
    }
    
    useEffect(()=>{
        loadProfile();
    }, [userid]);

    /**save for editing */
    async function save(){
        await loadProfile();
        setEditing(false);
    }

    if(!profile){
        return (<p>loading profile</p>);
    }
    return(
    <>
    {editing ? <EditProfile userid={userid}
                    currentBio={profile.bio}
                    currentInterests={profile.interests}
                    currentRelationships={relationships}
                    currentLanguages={languages}
                    currentAvailability={availability}
                    onSave={save}
                    onCancel={() => setEditing(false)}
                /> : (
    <div className="profilePage">
        <div className="card">
        <div className='profileEditButtons'>
            <button className="editProfileButton" onClick={() => setEditing(true)}>Edit Profile</button>
            <ProfileAssistant userid={userid} />
        </div>
        <div className="profilePicture">👤</div>
        <h2>{profile.name}, {profile.age}</h2>
        <div className="profileSection">
            <h3>My Bio</h3>
            <p className='bioText'>{profile.bio ? profile.bio: "No bio set"}</p>
        </div>
        <div className="profileSection">
            <h3>My Availability</h3>
            <div className='tagList'>
                {availability.length === 0 ? <p>None Selected</p>: 
                    availability.map((slot) => (
                        <span className="profileTag" key ={`${slot.day} ${slot.period}`}>
                            {slot.day} {slot.period}
                        </span>
                    ))
                }
            </div>
        </div>
        <div className="profileSection">
            <h3>My Interests</h3>
            <div className='tagList'>
                {profile.interests.map((interest) => (
                    <span className="profileTag" key ={interest}>{interest}</span>
                ))}
            </div>
        </div>
        <div className="profileSection">
            <h3>My Preferences</h3>
            <div className='preferencesSection'>
                <h4>Relationship Types</h4>
                <div className='tagList'>
                {relationships.length === 0 ? <p>None Selected</p>: 
                    relationships.map((relationship) => (
                        <span className="profileTag" key ={relationship}>{relationship}</span>
                    ))
                }
                </div>
            </div>
            <div className='preferencesSection'>
                <h4>Languages</h4>
                <div className='tagList'>
                {languages.length === 0 ? <p>None Selected</p>: 
                    languages.map((language) => (
                        <span className="profileTag" key ={language}>{language}</span>
                    ))
                }
                </div>
            </div>
        </div>
        </div>
    </div>)}</>);
}
export default Profile;