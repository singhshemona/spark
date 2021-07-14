import Head from "next/head";
import Link from "next/link";
import { getDatabase, getBlocks } from "../lib/notion";
import { Text } from "./[id].js";
import styles from "./index.module.css";

export const databaseId = process.env.NOTION_DATABASE_ID;

export default function Home({ posts, test }) {
  return (
    <div>
      <Head>
        <title>Notion Next.js blog</title>
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

        <h2 className={styles.heading}>All Posts</h2>
          {console.log(posts)}
          {console.log(test)}
        <button onClick={() => {window.location.href = window.origin}}>New Note</button>
          {/* {posts.map((post) => {
            const date = new Date(post.last_edited_time).toLocaleString(
              "en-US",
              {
                month: "short",
                day: "2-digit",
                year: "numeric",
              }
            );
            return (
              <li key={post.id}>
                <h3 className={styles.postTitle}>
                  <Link href={`/${post.id}`}>
                    <a>
                      {console.log(post)}
                      <Text text={post.properties.Title} />
                    </a>
                  </Link>
                </h3>

                <p className={styles.postDescription}>{date}</p>
                <Link href={`/${post.id}`}>
                  <a> Read post →</a>
                </Link>
              </li>
            );
          })} */}
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
  
  const blockId = database[randomIndex].id
  const block = await getBlocks(blockId)

  return {
    props: {
      test: pageDetails,
      posts: block
    },
    revalidate: 1,
  };
};

