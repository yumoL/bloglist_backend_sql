CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author text,
  url text NOT NULL,
  title text not NULL,
  likes integer DEFAULT 0
);

INSERT INTO blogs (author,url,title) 
values ('Alex','http://alex_blog.com','blog1');

INSERT INTO blogs (author,url,title,likes) 
values ('Jane','http://Jane_blog.com','blog2',3);

