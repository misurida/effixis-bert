import { Article, ArticleEntity, ArticleTopic, Entity, Topic, Event } from "./types"

export const isValidData = (e: any) => {
  if (!isValidArticles(e.articles)) {
    return false
  }
  if (!isValidEvents(e.events)) {
    return false
  }
  if (!isValidTopics(e.topics)) {
    return false
  }
  if (!isValidArticleTopics(e.articles_topics)) {
    return false
  }
  if (!isValidEntities(e.entities)) {
    return false
  }
  if (!isValidArticleEntities(e.articles_entities)) {
    return false
  }
  return true
}

export const isValidArticle = (e: Article, i: number) => {
  if (typeof e.id !== "string") throw `article.id: format error (${i})`
  if (typeof e.title !== "string") throw `article.title: format error (${i})`
  if (typeof e.event_id !== "string" && e.event_id !== null) throw `article.event_id: format error (${i})`
  if (typeof e.date !== "string") throw `article.date: format error (${i})`
  return true
}

export const isValidArticles = (e: unknown) => {
  return e && Array.isArray(e) && e.length > 0 && e.every(isValidArticle)
}

export const isValidEvent = (e: Event, i: number) => {
  if (typeof e.id !== "string") throw `event.id: format error (${i})`
  if (typeof e.name !== "string") throw `event.name: format error (${i})`
  if (typeof e.date !== "string") throw `event.date: format error (${i})`
  return true
}

export const isValidEvents = (e: unknown) => {
  return e && Array.isArray(e) && e.length > 0 && e.every(isValidEvent)
}

export const isValidTopic = (e: Topic, i: number) => {
  if (typeof e.id !== "string") throw `topic.id: format error (${i})`
  if (typeof e.name !== "string") throw `topic.name: format error (${i})`
  return true
}

export const isValidTopics = (e: unknown) => {
  return e && Array.isArray(e) && e.length > 0 && e.every(isValidTopic)
}

export const isValidArticleTopic = (e: ArticleTopic, i: number) => {
  if (typeof e.article_id !== "string") throw `article_topic.id: format error (${i})`
  if (typeof e.topic_id !== "string") throw `article_topic.name: format error (${i})`
  return true
}

export const isValidArticleTopics = (e: unknown) => {
  return e && Array.isArray(e) && e.length > 0 && e.every(isValidArticleTopic)
}

export const isValidEntity = (e: Entity, i: number) => {
  if (typeof e.id !== "string") throw `entity.id: format error (${i})`
  if (typeof e.name !== "string") throw `entity.name: format error (${i})`
  return true
}

export const isValidEntities = (e: unknown) => {
  return e && Array.isArray(e) && e.length > 0 && e.every(isValidEntity)
}

export const isValidArticleEntity = (e: ArticleEntity, i: number) => {
  if (typeof e.article_id !== "string") throw `article_entity.article_id: format error (${i})`
  if (typeof e.entity_id !== "string") throw `article_entity.entity_id: format error (${i})`
  return true
}

export const isValidArticleEntities = (e: unknown) => {
  return e && Array.isArray(e) && e.length > 0 && e.every(isValidArticleEntity)
}
