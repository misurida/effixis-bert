
import fs from 'fs'
let rawData = fs.readFileSync('./data.json');

const data = JSON.parse(rawData as any)

const articles = data.articles
const events = data.events
const topics = data.topics
const articles_topics = data.articles_topics
const entities = data.entities
const articles_entities = data.articles_entities



console.log(topics.map((a: any) => a.top_words))

/* fs.writeFile(`./data2.json`, JSON.stringify(receiptsList), (err: any) => {
  if (err) console.log('Error writing file:', err);
}) */

