\c nc_news_test

SELECT article.*, COUNT({})  AS comment_count FROM article
LEFT JOIN comment ON comment.article_id = article.article_id
GROUP BY article.article_id;
