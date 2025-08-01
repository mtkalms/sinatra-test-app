type Blog = {
    id: integer
    name: string
    tagline: string
}

type Post = {
    id: integer
    blog_id: integer
    headline: string
    text: string
}