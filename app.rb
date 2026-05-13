require 'sinatra'
require 'sinatra/activerecord'

Dir.glob('./{models,controllers}/*.rb').each { |file| require file }

# When FRONTEND_DEV=true, the react_app view loads the bundle from
# webpack-dev-server (port 8080) for hot reloading instead of the built file.
set :frontend_dev, ENV['FRONTEND_DEV'] == 'true'

before do
  content_type :json
end

# Catch-all: serve the React SPA for any route not matched above.
# Must be defined after all API routes so they take precedence.
get '*' do
  content_type :html
  erb :react_app
end
