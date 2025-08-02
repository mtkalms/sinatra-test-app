require 'uri'

get '/blogs/:blog_id/posts' do
  blog = Blog.find_by_id(params[:blog_id])
  @posts = blog.posts
  @posts.to_json
end

post '/blogs/:blog_id/posts' do
  @post = Post.create(
    blog_id: params[:blog_id],
    headline: params[:headline],
    body_text: params[:body_text]
  )
  if @post.save
    status 201
    puts request.referrer
    referrer_uri = URI.parse(request.referrer)
    referrer_base = "#{referrer_uri.scheme}://#{referrer_uri.host}"
    referrer_base += ":#{referrer_uri.port}" if referrer_uri.port
    redirect referrer_base + "/blogs/#{params[:blog_id]}/posts/#{@post.id}/view"
  else
    status 422
    { error: 'Failed to create post' }.to_json
  end
end

get '/posts/:id' do
  @post = Post.find_by_id(params[:id])
  @post.to_json
end

get '/posts/:id/view' do
  content_type :html
  @post = Post.find_by_id(params[:id])
  halt 404, { error: 'Post not found' }.to_json if @post.nil?
  @blog = Blog.find_by_id(@post.blog_id)
  erb :posts_view
end

get '/blogs/:blog_id/posts/view' do
  content_type :html
  @blog = Blog.find_by_id(params[:blog_id])
  @posts = @blog.posts
  erb :posts
end

get '/blogs/:blog_id/posts/:id/view' do
  content_type :html
  @post = Post.find_by_id(params[:id])
  halt 404, { error: 'Post not found in this blog' }.to_json if @post.nil? or @post.blog_id != params[:blog_id].to_i
  @blog = Blog.find_by_id(@post.blog_id)
  erb :posts_view
end

get '/blogs/:blog_id/posts/new' do
  content_type :html
  @blog = Blog.find_by_id(params[:blog_id])
  erb :posts_new
end
