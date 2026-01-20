
export default async function Page() {
    let data = await fetch('https://api.vercel.app/blog')
    let posts = await data.json()
    return (
      <div>
        <ul>
          home
        </ul>
      </div>
    )
  }