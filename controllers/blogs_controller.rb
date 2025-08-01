get '/blogs' do
  @blogs = Blog.all
  @blogs.to_json
end

post '/blogs' do
  @blog = Blog.create(
    name: params[:name], 
    tagline: params[:tagline]
  ) 
  if @blog.save
    status 201
    redirect request.referrer + "/blogs/#{@blog.id}/view"
  else
    status 422
    { error: 'Failed to create blog' }.to_json
  end
end

get '/blogs/view' do
  content_type :html
  @blogs = Blog.all
  erb :blogs
end

get '/blogs/new' do
  content_type :html
  erb :blogs_new
end

get '/blogs/:id' do
  @blog = Blog.find_by_id(params[:id])
  @blog.to_json
end

get '/blogs/:id/view' do
  content_type :html
  @blog = Blog.find_by_id(params[:id])
  @posts = @blog.posts
  erb :blogs_view
end
