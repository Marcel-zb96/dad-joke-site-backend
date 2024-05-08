
const getParsedJokeAuth = (joke, user) => {
  return {
    ...joke,
    author: joke.author.userName,
    likes: joke.likes.length,
    likedByUser: joke.likes.some((id) => id.equals(user._id))
  }
}

const getParsedJokeNonAuth = (joke) => {
  return {
    ...joke,
    punchline: "Really funny punchline",
    author: joke.author.userName,
    likes: joke.likes.length,
    likedByUser: false
  }
}

const parseUser = (user) => {
  return {
    userInfo: {
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      email: user.email,
    },
    createdAt: `${user.createdAt.getFullYear()}-${("0" + (user.createdAt.getMonth() + 1)).slice(-2)}-${user.createdAt.getDate()}`
  }
}


export { getParsedJokeAuth, getParsedJokeNonAuth, parseUser };