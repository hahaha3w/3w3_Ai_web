/* eslint-disable @typescript-eslint/no-explicit-any */
import { loadOml2d } from "oh-my-live2d";
import { memo, useEffect, useRef, useState } from "react";

const Oml2d = memo(() => {
  const oml2dRef = useRef<HTMLDivElement>(null);
  const [oml2d, setOml2d] = useState<any>(null);

  useEffect(() => {
    const newOml2d = loadOml2d({
      parentElement: oml2dRef.current!,
      models: [
        {
          path: "https://registry.npmmirror.com/oml2d-models/latest/files/models/Senko_Normals/senko.model3.json",
          position: [0, 0],
          name: "whiteCat",
          scale: 0.4,
          stageStyle: {
            height: 300,
          },
        },
      ],
    });

    newOml2d.onLoad((state) => {
      console.log(state);
      switch (state) {
        case "success":
          console.log("加载成功");
          break;
        case "fail":
          console.log("加载失败");
          break;
        case "loading":
          console.log("加载中");
          break;
        default:
          console.log("state");
          break;
      }
    });

    setOml2d(newOml2d);

    newOml2d.loadModelByName("whiteCat");
  }, []);

  return <div></div>;
});

export default Oml2d;
