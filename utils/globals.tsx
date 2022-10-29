import { OrderByAction } from "../components/OrderByMenu"

export const orderByNameLinkedArticlesActions: OrderByAction[] = [{
  label: "Name",
  title: "Name (asc)",
  prop: "name",
  desc: false
}, {
  label: "Name",
  title: "Name (desc)",
  prop: "name",
  desc: true
}, {
  label: "Linked articles",
  title: "Linked articles (asc)",
  prop: "linkedArticles",
  desc: false
}, {
  label: "Linked articles",
  title: "Linked articles (desc)",
  prop: "linkedArticles",
  desc: true
}]

export const orderByTitleActions: OrderByAction[] = [{
  label: "Title",
  title: "Title (asc)",
  prop: "title",
  desc: false
}, {
  label: "Title",
  title: "Title (desc)",
  prop: "title",
  desc: true
}, {
  label: "Linked entities",
  title: "Linked entities (asc)",
  prop: "linkedEntities",
  desc: false
}, {
  label: "Linked entities",
  title: "Linked entities (desc)",
  prop: "linkedEntities",
  desc: true
}]

export const orderByDateActions: OrderByAction[] = [{
  label: "Date",
  title: "Date (asc)",
  prop: "date",
  type: "date",
  desc: false
}, {
  label: "Date",
  title: "Date (desc)",
  prop: "date",
  type: "date",
  desc: true
}]