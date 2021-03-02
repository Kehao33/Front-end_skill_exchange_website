import React,{useState,useEffect} from "react";
import { reqRssArticles } from "../../requestAPI/operHttp";

const Rss = () => {
  const rssUrls = [
    { url: "https://rsshub.app/juejin/collection/6845243180586123271" },
    { url: "https://rsshub.app/front-end-rss" },
    { url: "https://rsshub.app/jskou/0" },
    { url: "https://rsshub.app/jskou/1" },
  ];

  const [rss,setRss]  = useState([]);

  useEffect(() => {
   const getRss  = async () => {
     const rssArticles = await reqRssArticles({urls: JSON.stringify(rssUrls)});
     console.log(rssArticles)
     setRss(rssArticles)
   }
   getRss();
  }, [rssUrls])

  return <div>RSS 阅读</div>;
};

export default Rss;
