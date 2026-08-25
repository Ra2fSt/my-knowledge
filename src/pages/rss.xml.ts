import rss from "@astrojs/rss";
import { getNotes } from "../lib/notes";
import { SITE_TITLE, SITE_DESCRIPTION } from "../consts";

// RSS 订阅源：全部笔记，排序与全站一致（updatedDate 降序）
export async function GET(context: { site: URL | undefined }) {
  const notes = await getNotes();
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site ?? "http://localhost:4321",
    items: notes.map((note) => ({
      title: note.data.title,
      description: note.data.description ?? "",
      pubDate: note.data.pubDate,
      link: `/notes/${note.id}/`,
      categories: note.data.tags,
    })),
  });
}
