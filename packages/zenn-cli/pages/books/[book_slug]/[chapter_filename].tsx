import Head from 'next/head';
import { NextPage, GetServerSideProps } from 'next';

import markdownToHtml from 'zenn-markdown-html';
import { ContentBody } from '@components/ContentBody';
import { ChapterHeader } from '@components/ChapterHeader';
import { MainContainer } from '@components/MainContainer';
import { getBookNavCollections } from '@utils/nav-collections';
import { getChapter } from '@utils/api/chapters';

import { Chapter, NavCollections } from '@types';

type Props = {
  chapter: Chapter;
  bookNavCollections: NavCollections;
};

const Page: NextPage<Props> = ({ chapter, bookNavCollections }) => {
  return (
    <>
      <Head>
        <title>{chapter.title || chapter.filename}のプレビュー</title>
      </Head>
      <MainContainer navCollections={bookNavCollections}>
        <article>
          <ChapterHeader chapter={chapter} />
          <ContentBody content={chapter.content} />
        </article>
      </MainContainer>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({
  res,
  params,
}) => {
  const bookSlug = params.book_slug as string;
  const chapterFilename = params.chapter_filename as string;

  const bookNavCollections = getBookNavCollections(bookSlug);

  const chapter = getChapter(bookSlug, chapterFilename);

  if (!chapter) {
    if (res) {
      res.writeHead(301, { Location: `/books/${bookSlug}` });
      res.end(); // 🚩 Do not forget escape if you return messgae here.
      return {
        props: {} as any,
      };
    }
  }

  chapter.content = markdownToHtml(chapter.content);

  return {
    props: {
      chapter,
      bookNavCollections,
    },
  };
};

export default Page;
