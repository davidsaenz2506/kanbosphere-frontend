import React, { useState } from "react";

import { DateTime } from "luxon";
import NewsCard from "./NewsCard";
import { INewsCard } from "@/domain/entities/newsCard";

const NewsComponent = () => {
  const currentDateTime: string = DateTime.now().toFormat("DDD").toString();
  const [currentPaginateNotice, setCurrentPaginateNotice] = useState<number>(0);
  const newsTumbleMockData: INewsCard[] = [
    {
      author: "Laura Villamil",
      role: "Director of Design Services and Co-Founder",
      date: currentDateTime,
      content:
        "Nos alegra comunicarte que se está implementando la versión 4.5 de Tumble Tasks, te ofreceremos muchas novedades para que puedas realizar tus tareas del día a día, te deseamos un excelente día, atentamente, Tumble Dev Management",
      image:
        "https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    },
    {
      author: "Laura Villamil",
      role: "Director of Design Services and Co-Founder",
      date: currentDateTime,
      content:
        "Tumble Tasks ampliará sus plataformas para dar servicios de administración y gestión documental en agosto, no te lo pierdas, será una barbaridad! 😍💻",
      image:
        "https://papyrum.com/wp-content/uploads/2018/07/beneficios_de_la_gestion_documental.png",
    },
    {
      author: "David Saenz",
      role: "Tumble Company CEO",
      date: currentDateTime,
      content:
        "Tumble Tasks ahora tiene una nueva apariencía! 🎨💻 Optimizamos su visualización para que luzca mucho más limpia y genial, feliz Julio! 😎",
      image:
        "https://papyrum.com/wp-content/uploads/2018/07/beneficios_de_la_gestion_documental.png",
    },
  ];

  const changeAction = () => {
    if (currentPaginateNotice >= newsTumbleMockData.length - 1)
      setCurrentPaginateNotice(0);
    else setCurrentPaginateNotice(currentPaginateNotice + 1);
  };

  return (
    <div
      className="tumbleNewsSection"
      style={{
        display: "flex",
        flexDirection: "column",
        paddingBottom: "60px",
      }}
    >
      <NewsCard
        cardItems={newsTumbleMockData[currentPaginateNotice]}
        changeAction={changeAction}
      />
    </div>
  );
};

export default NewsComponent;
