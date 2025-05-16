export default function Home({ session }) {
    if (!session) return <p>You must <a href="/auth/login">login</a></p>
    return <div>Welcome, {session.user.email}</div>
  }
  