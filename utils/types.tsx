export interface Data {
  articles?: Article[]
  events?: Event[],
  topics?: Topic[],
  articles_topics?: ArticleTopic[],
  entities?: Entity[],
  articles_entities?: ArticleEntity[],
}

export interface Article {
  id: string
  title: string
  event_id: string
  date: string
  url: string
  linkedEntities?: Entity[]
  linkedTopics?: string[]
}

export interface Event {
  id: string
  name: string
  date: string
  linkedArticles?: Article[]
}

export interface Topic {
  id: string
  name: string
  color?: string
  topwords?: string[]
  linkedArticles?: Article[]
}

export interface ArticleTopic {
  article_id: string
  topic_id: string
}

export interface Entity {
  id: string
  name: string
  linkedArticles?: string[]
}

export interface ArticleEntity {
  article_id: string
  entity_id: string
}



export interface DateFilter {
  mode: 'after' | 'before' | 'between'
  value: Date | null
  valueRange: [Date | null, Date | null]
}

export interface OrderBy {
  prop: string
  desc: boolean
}