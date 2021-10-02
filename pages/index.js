import Head from "next/head";
import { getDatabase, getBlocks, getPage } from "../lib/notion";
import styles from "../styles/index.module.css";

export const databaseId = process.env.NOTION_DATABASE_ID;

export default function Home({ summary, content, source, emoji }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Spark</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.quote}>
        <p className={styles.summary}>{summary}</p>
        <div className={styles.content}>
          {content.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </div>
        <p className={styles.source}><span className={styles.sourceTitle}>Source:</span> {emoji} {source}</p>
      </main>
      <form action="https://slip-box-sparks.herokuapp.com">
        <input className={styles.button} type="submit" value="New Spark" />
      </form>
      <a className={styles.link} target="_blank" href='https://www.notion.so/35de7cb65366432eb56d815a97a4767e' className={styles.heading}>Slip-Box</a>
    </div>
  );
}

function getRandomIndex(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

export const getStaticProps = async () => {
  const database = await getDatabase(databaseId);
  const randomIndex = getRandomIndex(0, database.length)

  const pageDetails = database[randomIndex]
  const summary = pageDetails.properties.Title.title[0].plain_text
  
  const blockId = database[randomIndex].id
  const block = await getBlocks(blockId)

  const content = []
  block.map((para) => para.paragraph.text[0] && content.push(para.paragraph.text[0].plain_text))

  const quotePage = await getPage(blockId)
  const sourcePage = await getPage(quotePage.properties.Source.relation[0].id)

  const emoji = sourcePage.icon.emoji
  const source = sourcePage.properties.Title.title[0].plain_text

  return {
    props: {
      content: content,
      emoji: emoji,
      source: source,
      summary: summary
    },
    revalidate: 1,
  };
};

