import { useState, useEffect } from 'react'

function Profile({ userid }){
    const [profile, setProfile] = useState(null);
    const [relationships, setRelationships] = useState([]);
    const [languages, setLanguages] = useState([]);
    useEffect(()=>{
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

            } catch (error){
                console.error("Failed to load profile", error);
                alert(error.message);
            }
        }
        loadProfile();
    }, [userid]);

    if(!profile){
        return (<p>loading profile</p>);
    }
    return(
    <div className="profilePage">
        <div className="profileCard">
        <button className="editProfileButton">Edit Profile</button>
        <div className="profilePicture">👤</div>
        <h2>{profile.name}, {profile.age}</h2>
        <div className="profileSection">
            <h3>My Bio</h3>
            <p>No bio set</p>
        </div>
        <div className="profileSection">
            <h3>My Availability</h3>
            <p>No availability set</p>
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
                {relationships.length === 0 ? <p>None Selected</p>: 
                    relationships.map((relationship) => (
                        <span className="profileTag" key ={relationship}>{relationship}</span>
                    ))
                }
            </div>
            <div className='preferencesSection'>
                <h4>Languages</h4>
                {languages.length === 0 ? <p>None Selected</p>: 
                    languages.map((language) => (
                        <span className="profileTag" key ={language}>{language}</span>
                    ))
                }
            </div>
        </div>
        </div>
    </div>);
}
export default Profile;