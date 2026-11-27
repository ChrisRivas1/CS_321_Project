import { useState, useEffect } from 'react'

function Explore({ userid }) {
    const [candidates, setCandidates] = useState([]);
    const [index, setIndex] = useState(0);
    const [matchedUser, setMatchedUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function loadCandidates() {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/users/${userid}/candidates`);
            if (!response.ok) {
                throw new Error("Failed to load candidates");
            }
            const data = await response.json();
            setCandidates(data.candidates);
            setIndex(0);
        } catch (error) {
            console.error("Failed to load candidates", error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadCandidates();
    }, [userid]);

    async function swipe(liked) {
        const candidate = candidates[index];
        try {
            const response = await fetch(`http://localhost:8000/users/${userid}/swipes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ swipeeid: candidate.userid, liked: liked })
            });
            if (!response.ok) {
                throw new Error("Failed to record swipe");
            }
            const data = await response.json();
            if (data.matched) {
                setMatchedUser(candidate);
            }
            setIndex(index + 1);
        } catch (error) {
            console.error("Failed to record swipe", error);
            alert(error.message);
        }
    }

    function messageScreen(title, message, buttonLabel, onClick) {
        return (
            <div className="matchScreen">
                <div className="card">
                    <h2>{title}</h2>
                    <p>{message}</p>
                    <div className="matchButtons">
                        <button className="editProfileButton" onClick={onClick}>
                            {buttonLabel}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (<p>loading candidates</p>);
    }

    if (matchedUser) {
        return messageScreen(
            "It's a match!",
            `You and ${matchedUser.name} liked each other.`,
            "Keep Swiping",
            () => setMatchedUser(null)
        );
    }

    if (index >= candidates.length) {
        return messageScreen(
            "No more users",
            "Check back later for more people to explore.",
            "Refresh",
            loadCandidates
        );
    }

    const candidate = candidates[index];

    return (
        <div className="matchScreen">
            <div className="card">
                <div className="profilePicture">👤</div>
                <h2>{candidate.name}, {candidate.age}</h2>
                <div className="profileSection">
                    <h3>Bio</h3>
                    <p className="bioText">{candidate.bio ? candidate.bio : "No bio set"}</p>
                </div>
                <div className="profileSection">
                    <h3>Interests</h3>
                    <div className="tagList">
                        {candidate.interests.map((interest) => (
                            <span className="profileTag" key={interest}>{interest}</span>
                        ))}
                    </div>
                </div>
                <div className="matchButtons">
                    <button className="passButton" onClick={() => swipe(false)}>✕ Pass</button>
                    <button className="likeButton" onClick={() => swipe(true)}>♥ Like</button>
                </div>
            </div>
        </div>
    );
}

export default Explore;