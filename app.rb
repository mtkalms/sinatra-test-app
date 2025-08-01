require 'sinatra'
require 'sinatra/activerecord'

Dir.glob('./{models,controllers}/*.rb').each { |file| require file }

before do
  headers 'Access-Control-Allow-Origin' => '*' if settings.development?
  content_type :json
end

set :protection, :except => :frame_options

get '/' do
  p 'Hello!'
end
