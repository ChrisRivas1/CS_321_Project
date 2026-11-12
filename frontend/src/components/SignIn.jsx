import { useState } from "react";
import CreateProfile from './CreateProfile';
function SignIn({ onSave }){
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [createProfile, setCreateProfile] = useState(false);
    async function signIn() {
        try{
            const response = await fetch("http://localhost:8000/users/signin",{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    input: user
                })
            });
            if (!response.ok){
                throw new Error("Failed to sign in");
            }
            const data = await response.json();
            onSave(data.userid);
        } catch (error){
            console.error("Failed to sign in", error);
            alert("Failed to sign in. Try again");
        }
    }
    return(
    <div className="signIn"> {createProfile === false && (
        <div className="signInScreen">
            <h2>Sign In</h2>
            <form onSubmit={(e) => {e.preventDefault(); signIn();}}>
                <div className="signInInputs">
                <input type="text"
                    placeholder="USERNAME/EMAIL"
                    value={user}
                    onChange={(e) =>{setUser(e.target.value)}}
                    required
                />
                <input type="password"
                    placeholder="PASSWORD"
                    value={password}
                    onChange={(e) =>{setPassword(e.target.value)}}
                    required
                />
                <button className="createProfileButton"
                    type="button"
                    onClick={() => setCreateProfile(true)}
                >CREATE PROFILE</button>
                <button className="signInButton" type="submit">SIGN IN</button>
                </div>
            </form> 
        </div>
    )} 
    {createProfile === true && (<CreateProfile onSave={onSave}/>)}
    </div>);
}
export default SignIn;