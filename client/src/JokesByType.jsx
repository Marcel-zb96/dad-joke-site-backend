import { Link } from "react-router-dom"
import Joke from "./Joke"
import { useEffect, useState } from "react"

export default function JokesByType({ jokeType }) {

  const [jokes, setJokes] = useState([])

  useEffect(() => {
    const fetchJokes = async () => {
      const response = await fetch(`/api/jokes?type=${jokeType}`);
      const data = await response.json();
      setJokes(data)
    }
    fetchJokes()
  }, [])

    return (
        <>
            <ul>
                {jokes.map((joke) => <Joke joke={joke} />)}
            </ul>
        </>
    )
}