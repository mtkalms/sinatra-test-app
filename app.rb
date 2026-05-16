require 'sinatra'
require 'sinatra/activerecord'
require 'herb'
require 'active_support/core_ext/string/output_safety'

Dir.glob('./{models,controllers}/*.rb').each { |file| require file }

set :erb, engine_class: Herb::Engine, validation_mode: (development? ? :overlay : :raise)
set :public_folder, File.dirname(__FILE__) + '/public'

use Rack::Static, urls: ['/node_modules'], root: File.dirname(__FILE__)
helpers do
  def development?
    settings.environment == :development
  end

  def herb_debug_attrs(view_name, outline_type: 'view')
    file_name = "#{view_name}.erb"
    file_rel_path = File.join('views', file_name)
    file_abs_path = File.join(settings.root, file_rel_path)

    %(data-herb-debug-outline-type="#{outline_type}" data-herb-debug-file-name="#{file_name}" data-herb-debug-file-relative-path="views/#{file_rel_path}" data-herb-debug-file-full-path="#{file_abs_path}")
  end
end

before do
  content_type :json
end

get '/' do
  content_type :html
  erb :index
end
