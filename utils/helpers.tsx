import { DateFilter, OrderBy } from "./types"
import dayjs from "dayjs";
import { OrderByAction } from "../components/OrderByMenu";

export const norm = (str: string) => {
  return str.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase()
}

export function filterArray<T>(array: T[], prop: (keyof T)[], query?: string, eventsDateFilter?: DateFilter) {
  let o: T[] = JSON.parse(JSON.stringify(array));
  if (query) {
    const q = norm(query)
    o = o.filter(e => norm(prop.reduce((a,p) => [...a, (e[p]?.toString() || "")], [] as string[]).join(" ")).includes(q))
  }
  if (eventsDateFilter) {
    const v = dayjs(eventsDateFilter.value)
    o = o.filter((e: any) => {
      const d = dayjs(e.date)

      if (eventsDateFilter.value) {
        if (eventsDateFilter.mode === "before") {
          return d.isBefore(v)
        }
        if (eventsDateFilter.mode === "after") {
          return d.isAfter(dayjs(eventsDateFilter.value))
        }
      }
      else if (eventsDateFilter.valueRange[0] && eventsDateFilter.valueRange[1] && eventsDateFilter.mode === "between") {
        return d.isAfter(dayjs(eventsDateFilter.valueRange[0])) && d.isBefore(dayjs(eventsDateFilter.valueRange[1]))
      }
      return false
    })
  }
  return o
}

export function sortArray<T>(array: T[], orderBy: OrderByAction) {
  const p = orderBy.prop as keyof T
  const desc = orderBy.desc
  const t = orderBy.type
  array.sort((a, b) => {
    let A: any = a[p]
    let B: any = b[p]
    if (t === "date") {
      return desc ?
        (dayjs(A).isBefore(dayjs(B)) ? 1 : -1) :
        (dayjs(B).isBefore(dayjs(A)) ? 1 : -1)
    }
    if (Array.isArray(A)) A = A.length
    if (Array.isArray(B)) B = B.length
    if (typeof A === "number" && typeof B === "number") {
      return desc ? B - A : A - B;
    }
    if (typeof A === "string") A = norm(A)
    if (typeof B === "string") B = norm(B)
    return desc ?
      (B > A ? 1 : -1) :
      (A > B ? 1 : -1)
  })

  return array
}