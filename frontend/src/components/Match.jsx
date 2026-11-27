import { useState, useEffect } from 'react'

function Match({ userid }) {
    const [matches, setMatches] = useState([]);

    async function loadMatches() {
        try {
            const response = await fetch(`http://localhost:8000/users/${userid}/matches`);
            if (!response.ok) {
                throw new Error("Failed to load matches");
            }
            const data = await response.json();
            setMatches(data.matches);
        } catch (error) {
            console.error("Failed to load matches", error);
            alert(error.message);
        }
    }

    useEffect(() => {
        loadMatches();
    }, [userid]);

    if (matches.length === 0) {
        return (
            <div className="matchesScreen">
                <div className="card">
                    <h2>No matches yet</h2>
                    <p>Head to Explore and start liking people to make a match.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="matchesScreen">
            <h2>Your Matches</h2>
            <div className="matchesList">
                {matches.map((match) => (
                    <div className="card matchCard" key={match.userid}>
                        <div className="profilePicture">👤</div>
                        <h3>{match.name}, {match.age}</h3>
                        <div className="tagList">
                            {match.interests.map((interest) => (
                                <span className="profileTag" key={interest}>{interest}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Match;