import { useState, createContext, FC, useContext, Dispatch, SetStateAction, useMemo, useEffect } from "react";
import { OrderByAction } from "../components/OrderByMenu";
import { filterArray, sortArray } from "../utils/helpers";
import { Article, Data, Entity, Topic, Event, DateFilter, OrderBy } from "../utils/types";

export interface DataContext {
  articles: Article[]
  filteredArticles: Article[]
  events: Event[],
  filteredEvents: Event[],
  topics: Topic[],
  filteredTopics: Topic[],
  entities: Entity[]
  filteredEntities: Entity[]
  loadData: (data: Data) => Promise<void>
  setTopics: Dispatch<SetStateAction<Topic[]>>
  setArticles: Dispatch<SetStateAction<Article[]>>
  // articles
  articlesQuery: string
  setArticlesQuery: Dispatch<SetStateAction<string>>
  articlesDateFilter: DateFilter | undefined
  setArticlesDateFilter: Dispatch<SetStateAction<DateFilter | undefined>>
  articlesOrderBy: OrderByAction | undefined
  setArticlesOrderBy: Dispatch<SetStateAction<OrderByAction | undefined>>
  articlesMinLinkedEntities: number | undefined
  setArticlesMinLinkedEntities: Dispatch<SetStateAction<number | undefined>>
  articlesMaxLinkedEntities: number
  // entities
  selectedEntities: string[]
  setSelectedEntities: Dispatch<SetStateAction<string[]>>
  entitiesOrderBy: OrderByAction | undefined
  setEntitiesOrderBy: Dispatch<SetStateAction<OrderByAction | undefined>>
  // events
  eventsQuery: string
  setEventsQuery: Dispatch<SetStateAction<string>>
  eventsDateFilter: DateFilter | undefined
  setEventsDateFilter: Dispatch<SetStateAction<DateFilter | undefined>>
  eventsOrderBy: OrderByAction | undefined
  setEventsOrderBy: Dispatch<SetStateAction<OrderByAction | undefined>>
  eventsMinLinkedArticles: number | undefined
  setEventsMinLinkedArticles: Dispatch<SetStateAction<number | undefined>>
  eventsMaxLinkedArticles: number
  // topics
  selectedTopics: string[]
  setSelectedTopics: Dispatch<SetStateAction<string[]>>
  topicsQuery: string
  setTopicsQuery: Dispatch<SetStateAction<string>>
  topicsOrderBy: OrderByAction | undefined
  setTopicsOrderBy: Dispatch<SetStateAction<OrderByAction | undefined>>
  topicsMinLinkedArticles: number | undefined
  setTopicsMinLinkedArticles: Dispatch<SetStateAction<number | undefined>>
  topicsMaxDisplayedArticles: number | undefined
  setTopicsMaxDisplayedArticles: Dispatch<SetStateAction<number | undefined>>
  topicsMaxLinkedArticles: number

}

function useDataRoot() {

  const [loadWorker, setLoadWorker] = useState<Worker | undefined>()
  // lists
  const [articles, setArticles] = useState<Article[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [entities, setEntities] = useState<Entity[]>([])
  // articles
  const [articlesQuery, setArticlesQuery] = useState("")
  const [articlesDateFilter, setArticlesDateFilter] = useState<DateFilter | undefined>()
  const [articlesOrderBy, setArticlesOrderBy] = useState<OrderByAction | undefined>()
  const [articlesMinLinkedEntities, setArticlesMinLinkedEntities] = useState<number | undefined>(1)
  // entities
  const [selectedEntities, setSelectedEntities] = useState<string[]>([])
  const [entitiesOrderBy, setEntitiesOrderBy] = useState<OrderByAction | undefined>()
  // events
  const [eventsQuery, setEventsQuery] = useState("")
  const [eventsDateFilter, setEventsDateFilter] = useState<DateFilter | undefined>()
  const [eventsOrderBy, setEventsOrderBy] = useState<OrderByAction | undefined>()
  const [eventsMinLinkedArticles, setEventsMinLinkedArticles] = useState<number | undefined>(1)
  // topics
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [topicsQuery, setTopicsQuery] = useState("")
  const [topicsOrderBy, setTopicsOrderBy] = useState<OrderByAction | undefined>()
  const [topicsMinLinkedArticles, setTopicsMinLinkedArticles] = useState<number | undefined>(1)
  const [topicsMaxDisplayedArticles, setTopicsMaxDisplayedArticles] = useState<number | undefined>(10)

  useEffect(() => {
    const worker = new Worker(new URL('../workers/data_loader.worker', import.meta.url))
    setLoadWorker(worker)
    return () => {
      loadWorker?.terminate()
      setLoadWorker(undefined)
    }
  }, [])

  const filteredArticles = useMemo(() => {
    if (!articlesQuery && !articlesDateFilter && !articlesOrderBy && !selectedEntities.length && (articlesMinLinkedEntities || 0) <= 1 && !selectedTopics.length) {
      return []
    }
    let o = filterArray(articles, ["title", "id"], articlesQuery, articlesDateFilter)
    if(selectedTopics.length) {
      o = o.filter(e => e.linkedTopics?.some(f => selectedTopics.includes(f)))
    }
    if (selectedEntities.length > 0) {
      const l = entities.filter(e => selectedEntities.includes(e.id)).reduce((a, e) => [...a, ...(e.linkedArticles || [])], [] as string[])
      o = o.filter(a => l.includes(a.id))
    }
    if (articlesMinLinkedEntities !== undefined) {
      o = o.filter(e => (e.linkedEntities?.length || 0) >= articlesMinLinkedEntities)
    }
    if (articlesOrderBy) {
      sortArray(o, articlesOrderBy)
    }
    return o;
  }, [articles, selectedEntities, articlesQuery, articlesDateFilter, articlesOrderBy, articlesMinLinkedEntities, selectedTopics])

  const articlesMaxLinkedEntities = useMemo(() =>
    (filteredArticles.length > 0 ? filteredArticles : articles).reduce((a, e) => (e.linkedEntities?.length || 0) > a ? e.linkedEntities?.length || 0 : a, 0),
    [filteredArticles, articles]
  )

  // entities
  const filteredEntities = useMemo(() => {
    if (entitiesOrderBy) {
      const o = JSON.parse(JSON.stringify(entities))
      sortArray(o, entitiesOrderBy)
      return o
    }
    return [];
  }, [entities, entitiesOrderBy])

  // events
  const filteredEvents = useMemo(() => {
    if (!eventsQuery && !eventsDateFilter && !eventsOrderBy && !filteredArticles.length && (eventsMinLinkedArticles || 0) <= 1 && !selectedTopics.length) {
      return []
    }
    let o = filterArray(events, ["name", "id"], eventsQuery, eventsDateFilter)
    if (selectedTopics.length > 0) {
      const l = articles.filter(a => selectedTopics.some(t => a.linkedTopics?.includes(t))).map(a => a.id)
      o = o.filter(e => e.linkedArticles?.some(a => l.includes(a.id)))
    }
    if (filteredArticles.length > 0) {
      o = o.map(e => ({ ...e, linkedArticles: filteredArticles.filter(a => a.event_id === e.id) }))
    }
    if (eventsMinLinkedArticles !== undefined) {
      o = o.filter(e => (e.linkedArticles?.length || 0) >= eventsMinLinkedArticles)
    }
    if (eventsOrderBy) {
      sortArray(o, eventsOrderBy)
    }
    return o;
  }, [events, eventsQuery, eventsDateFilter, eventsOrderBy, eventsMinLinkedArticles, filteredArticles, selectedTopics])

  const eventsMaxLinkedArticles = useMemo(() =>
    (filteredEvents.length > 0 ? filteredEvents : events).reduce((a, e) => (e.linkedArticles?.length || 0) > a ? e.linkedArticles?.length || 0 : a, 0),
    [filteredEvents, events]
  )


  // topics
  const filteredTopics = useMemo(() => {
    let o = filterArray(topics, ["name", "id"], topicsQuery)
    if(selectedTopics.length) {
      return o
    }
    if (filteredArticles.length > 0) {
      const arIds = filteredArticles.map(a => a.id)
      o = o.map(e => ({ ...e, linkedArticles: e.linkedArticles?.filter(a => arIds.includes(a.id)) || [] }))
    }
    if (topicsMinLinkedArticles !== undefined) {
      o = o.filter(e => (e.linkedArticles?.length || 0) >= topicsMinLinkedArticles)
    }
    if (topicsOrderBy) {
      sortArray(o, topicsOrderBy)
    }
    return o;
  }, [topics, topicsQuery, topicsOrderBy, topicsMinLinkedArticles, filteredArticles, selectedTopics])

  const topicsMaxLinkedArticles = useMemo(() =>
    (filteredTopics.length > 0 ? filteredTopics : topics).reduce((a, e) => (e.linkedArticles?.length || 0) > a ? e.linkedArticles?.length || 0 : a, 0),
    [filteredTopics, topics]
  )

  /**
   * Load and parse data for the global app usage.
   * 
   * @param data 
   */
  const loadData = async (data: Data) => {
    loadWorker?.postMessage(data)
    return new Promise<void>((resolve, reject) => {
      loadWorker?.addEventListener('message', (event) => {
        setArticles(event.data.articles)
        setEvents(event.data.events)
        setTopics(event.data.topics)
        setEntities(event.data.entities)
        resolve()
      });
    })
  }

  return {
    articles,
    filteredArticles,
    events,
    filteredEvents,
    topics,
    filteredTopics,
    entities,
    filteredEntities,
    loadData,
    setTopics,
    setArticles,
    // articles
    articlesQuery,
    setArticlesQuery,
    articlesDateFilter,
    setArticlesDateFilter,
    articlesOrderBy,
    setArticlesOrderBy,
    articlesMinLinkedEntities,
    setArticlesMinLinkedEntities,
    articlesMaxLinkedEntities,
    // entities
    selectedEntities,
    setSelectedEntities,
    entitiesOrderBy,
    setEntitiesOrderBy,
    // events
    eventsQuery,
    setEventsQuery,
    eventsDateFilter,
    setEventsDateFilter,
    eventsOrderBy,
    setEventsOrderBy,
    eventsMinLinkedArticles,
    setEventsMinLinkedArticles,
    eventsMaxLinkedArticles,
    // topics
    selectedTopics,
    setSelectedTopics,
    topicsQuery,
    setTopicsQuery,
    topicsOrderBy,
    setTopicsOrderBy,
    topicsMinLinkedArticles,
    setTopicsMinLinkedArticles,
    topicsMaxDisplayedArticles,
    setTopicsMaxDisplayedArticles,
    topicsMaxLinkedArticles
  }
}

const dataContext = createContext<DataContext>({} as DataContext);

export interface DataProviderProps {
  children: React.ReactNode
}

/**
 * Handle firebase database actions
 * Use once at root of app, the use useData
 */
export const DataProvider: FC<DataProviderProps> = ({ children }) => {
  const values = useDataRoot();
  return (
    <dataContext.Provider value={values}>
      {children}
    </dataContext.Provider>
  );
}

/** 
 * Return context value (given by DataProvider)
 */
export function useData() {
  return useContext(dataContext);
}