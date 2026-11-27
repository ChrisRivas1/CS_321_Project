
import { useState } from "react";
import CreateProfile from './CreateProfile';

function SignIn({ onSave }){
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [createProfile, setCreateProfile] = useState(false);
    const [loading, setLoading] = useState(false);

    async function signIn() {
        if (loading) return;

        setLoading(true);

        try{
            const response = await fetch("http://localhost:8000/users/signin",{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    input: user,
                    password: password
                })
            });

            if (!response.ok){
                if (response.status === 401) {
                    throw new Error("Invalid username/email or password");
                }

                throw new Error("Failed to sign in. Please try again.");
            }

            const data = await response.json();
            onSave(data.userid);

        } catch (error){
            console.error("Failed to sign in", error);
            alert(error.message);
        } finally {
            setLoading(false);
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
                    autoComplete="username"
                    required
                />
                <input type="password"
                    placeholder="PASSWORD"
                    value={password}
                    onChange={(e) =>{setPassword(e.target.value)}}
                    autoComplete="current-password"
                    required
                />
                <button className="createProfileButton"
                    type="button"
                    onClick={() => setCreateProfile(true)}
                >CREATE PROFILE</button>
                <button className="signInButton"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "SIGNING IN..." : "SIGN IN"}
                </button>
                </div>
            </form>
        </div>
    )}
    {createProfile === true && (<CreateProfile onSave={onSave}/>)}
    </div>);
}

export default SignIn;
