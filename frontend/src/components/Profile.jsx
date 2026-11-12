import { useState, useEffect } from 'react'

function Profile({ userid }){
    const [profile, setProfile] = useState(null);
    useEffect(()=>{
        async function loadProfile() {
            try{
                const response = await fetch(`http://localhost:8000/users/${userid}`);
                if (!response.ok){
                    throw new Error("Failed to load profile");
                }
                const data = await response.json();
                setProfile(data);
            } catch (error){
                console.error("Failed to load profile", error);
                alert("Failed to load profile");
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
            <h3>My Bio - </h3>
            <p>No bio set</p>
        </div>
        <div className="profileSection">
            <h3>My Availability - </h3>
            <p>No availability set</p>
        </div>
        <div className="profileSection">
            <h3>My Interests - </h3>
            {profile.interests.map((interest) => (
                <span className="profileTag" key ={interest}>{interest}</span>
            ))}
        </div>
        <div className="profileSection">
            <h3>My Preferences - </h3>
            <p>No preferences set</p>
        </div>
        </div>
    </div>);
}
export default Profile;