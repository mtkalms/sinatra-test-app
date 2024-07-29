# active_sinatra
Multi-threaded Sinatra test application with ActiveRecord and thin server.

To install the bundle:

```bash
bundle install
```

To set up the development database:

```bash
rake db:migrate
rake db:fixtures:load
```

To run the web server:

```bash
thin start
```

Then hit the server in your browser at these addresses:

* [http://localhost:4567](http://localhost:4567)
* [http://localhost:4567/blogs](http://localhost:4567/blogs)
* [http://localhost:4567/blogs/413685242](http://localhost:4567/blogs/413685242)
* [http://localhost:4567/blogs/413685242/posts](http://localhost:4567/blogs/413685242/posts)
* [http://localhost:4567/posts/807550412](http://localhost:4567/posts/807550412)

To set up the test database:

```bash
rake db:test:prepare
```

To run the tests:

```bash
rake
```

To run the app in a console so you can inspect records or create new ones:

```bash
$ irb -r ./app.rb 
> Blog.find_by_name("Jimmy's Jottings").tagline
# => SQL log: SELECT "blogs".* FROM "blogs" WHERE "blogs"."name" = 'Jimmy''s Jottings' LIMIT 1
# => "Stuff Jimmy says" 
> Blog.create(:name => "Rob Rants")
# => SQL log: begin transaction
# => SQL log: INSERT INTO "blogs" ("name") VALUES (?)  [["name", "Rob Rants"]]
# => SQL log: commit transaction
# => #<Blog id: 705406077, name: "Rob Rants", tagline: nil> 
> 
```
