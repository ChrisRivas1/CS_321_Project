import { useState, useEffect } from "react";
import "./ProfileAssistant.css";

const API_BASE_URL = "http://localhost:8000";

export default function ProfileAssistant({ userid }) {
  const [isOpen, setIsOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    async function loadQuestions() {
      setLoadingQuestions(true);
      setError("");

      try {
        const response = await fetch(
          `${API_BASE_URL}/ai-assistant/questions`
        );

        if (!response.ok) {
          throw new Error("Unable to load questions.");
        }

        const data = await response.json();

        if (!cancelled) {
          setQuestions(data.questions || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoadingQuestions(false);
        }
      }
    }

    loadQuestions();

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  function openAssistant() {
    setSelectedQuestion("");
    setAnswer("");
    setError("");
    setIsOpen(true);
  }

  function closeAssistant() {
    if (loadingAnswer) return;
    setIsOpen(false);
  }

  async function askQuestion(questionId) {
    if (!userid || loadingAnswer) return;

    setSelectedQuestion(questionId);
    setAnswer("");
    setError("");
    setLoadingAnswer(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/users/${userid}/ai-assistant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question_id: questionId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 502 || response.status === 503) {
          throw new Error(
            "AI assistance is temporarily unavailable. " +
            "Please try again later."
          );
        }

        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Unable to get an AI response."
        );
      }

      setAnswer(data.answer || "No answer was returned.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoadingAnswer(false);
    }
  }

  const currentQuestion = questions.find(
    (question) => question.id === selectedQuestion
  );

  return (
    <div className="profile-assistant">
      <button
        type="button"
        className="profile-assistant-trigger"
        onClick={openAssistant}
      >
        ✨ AI Profile Assistant
      </button>

      {isOpen && (
        <div
          className="profile-assistant-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeAssistant();
            }
          }}
        >
          <section
            className="profile-assistant-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="assistant-title"
          >
            <div className="profile-assistant-header">
              <div>
                <h2 id="assistant-title">
                  ✨ AI Profile Assistant
                </h2>
                <p>
                  Get personalized suggestions based on
                  your profile.
                </p>
              </div>

              <button
                type="button"
                className="profile-assistant-close"
                onClick={closeAssistant}
                disabled={loadingAnswer}
                aria-label="Close AI assistant"
              >
                ×
              </button>
            </div>

            <div className="profile-assistant-content">
              <h3>What would you like help with?</h3>

              {loadingQuestions && (
                <p>Loading questions...</p>
              )}

              {!loadingQuestions && questions.length > 0 && (
                <div className="profile-assistant-questions">
                  {questions.map((question) => (
                    <button
                      key={question.id}
                      type="button"
                      className={
                        selectedQuestion === question.id
                          ? "assistant-question selected"
                          : "assistant-question"
                      }
                      onClick={() => askQuestion(question.id)}
                      disabled={loadingAnswer}
                    >
                      {question.text}
                    </button>
                  ))}
                </div>
              )}

              {loadingAnswer && (
                <p
                  className="assistant-loading"
                  role="status"
                >
                  Generating your suggestion...
                </p>
              )}

              {error && (
                <p className="assistant-error" role="alert">
                  {error}
                </p>
              )}

              {answer && (
                <div
                  className="assistant-answer"
                  aria-live="polite"
                >
                  <h3>{currentQuestion?.text}</h3>
                  <p>{answer}</p>
                </div>
              )}

              {!userid && (
                <p className="assistant-error">
                  Sign in to use the profile assistant.
                </p>
              )}
            </div>

            <div className="profile-assistant-footer">
              <span>
                Suggestions are generated using AI.
              </span>
              <button
                type="button"
                onClick={closeAssistant}
                disabled={loadingAnswer}
              >
                Close
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
