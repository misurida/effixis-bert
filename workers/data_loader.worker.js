self.addEventListener('message', async (event) => {
  const data = event.data
  const articlesD = data?.articles || []
  const eventsD = data?.events || []
  const topicsD = data?.topics || []
  const entitiesD = data?.entities || []
  const articleTopics = data?.articles_topics || []
  const articleEntities = data?.articles_entities || []
  const articles2 = articlesD.map(a => {
    const arTo = articleTopics.filter(at => at.article_id === a.id).map(at => at.topic_id)
    const linkedTopics = topicsD.filter(t => arTo.includes(t.id)).map(t => t.id)
    const arEn = articleEntities.filter(at => at.article_id === a.id).map(at => at.entity_id)
    const linkedEntities = entitiesD.filter(t => arEn.includes(t.id))
    return { ...a, linkedTopics, linkedEntities }
  })
  articles2.sort((a, b) => b.linkedEntities.length - a.linkedEntities.length)
  const events2 = eventsD.map(e => {
    const linkedArticles = articles2.filter(a => a.event_id === e.id)
    return { ...e, linkedArticles }
  })
  const topics2 = topicsD.map(t => {
    const arTo = articleTopics.filter(at => at.topic_id === t.id).map(at => at.article_id)
    const linkedArticles = articles2.filter(t => arTo.includes(t.id))
    return { ...t, linkedArticles }
  })
  events2.sort((a, b) => b.linkedArticles.length - a.linkedArticles.length)
  const entities2 = entitiesD.map(e => {
    const arEn = articleEntities.filter(at => at.entity_id === e.id).map(at => at.article_id)
    const linkedArticles = articles2.filter(t => arEn.includes(t.id)).map(a => a.id)
    return { ...e, linkedArticles }
  })
  postMessage({
    articles: articles2,
    events: events2,
    topics: topics2,
    entities: entities2
  });
});
