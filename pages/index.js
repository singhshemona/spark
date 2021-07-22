import Head from "next/head";
import { getDatabase, getBlocks } from "../lib/notion";
import styles from "./index.module.css";

export const databaseId = process.env.NOTION_DATABASE_ID;

export default function Home({ title, content }) {
  return (
    <div>
      <Head>
        <title>Shemona's Spark</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <header className={styles.header}>
          <h1>Get a new quote from your slip-box.</h1>
          <p>
            The data for this chrome extension comes from{" "}
            <a href={`https://www.notion.so/${databaseId}`}>this table</a>. Get
            the source code on{" "}
            <a href="https://github.com/samuelkraft/notion-blog-nextjs">
              Github
            </a>.
          </p>
        </header>
        <h2 className={styles.heading}>Remixer</h2>
        <p>{title}</p>
        <p>{content}</p>
        <button onClick={() => {window.location.href = window.origin}}>Generate New Note</button>
      </main>
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
  const pageNote = pageDetails.properties.Title.title[0].plain_text
  
  const blockId = database[randomIndex].id
  const block = await getBlocks(blockId)
  const blockText = block[0].paragraph.text[0].plain_text

  return {
    props: {
      title: pageNote,
      content: blockText
    },
    revalidate: 1,
  };
};

