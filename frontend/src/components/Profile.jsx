function Profile({ profile }){
    return(
    <div className="profilePage">
        <div className="profileCard">
        <button className="editProfileButton">Edit Profile</button>
        <div className="profilePicture">👤</div>
        <h2>{profile.name}, {profile.age}</h2>
        <div className="profileSection">
            <h3>My Availability - </h3>
            <span className="profileTag">Mondays</span>
            <span className="profileTag">Weekends</span>
        </div>
        <div className="profileSection">
            <h3>My Interests - </h3>
            {profile.interests.map((interest) => (
                <span className="profileTag" key ={interest}>{interest}</span>
            ))}
        </div>
        </div>
    </div>);
}
export default Profile;